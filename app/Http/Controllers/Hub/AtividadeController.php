<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Atividade;
use App\Models\AtividadeAluno;
use App\Models\AtividadeBloco;
use App\Models\AtividadeResposta;
use App\Models\TurmaCriada;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AtividadeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userType = $user->userType->name;

        $query = Atividade::query()
            ->with(['turmaCriada.turma', 'turmaCriada.professor', 'professor'])
            ->withCount([
                'atividadeAlunos as total_alunos_count',
                'atividadeAlunos as pendentes_count' => fn ($query) => $query->where('status', AtividadeAluno::STATUS_PENDENTE),
                'atividadeAlunos as entregues_count' => fn ($query) => $query->where('status', AtividadeAluno::STATUS_ENTREGUE),
            ]);

        if ($userType === 'professor') {
            $query->where(function ($query) use ($user) {
                $query->where('professor_id', $user->id)
                    ->orWhereHas('turmaCriada', fn ($turmaQuery) => $turmaQuery->where('professor_id', $user->id));
            });
        } elseif ($userType === 'aluno') {
            $query->whereHas('atividadeAlunos', fn ($query) => $query->where('aluno_id', $user->id))
                ->with(['atividadeAlunos' => fn ($query) => $query->where('aluno_id', $user->id)]);
        }

        return Inertia::render('Hub/Atividades/Index', [
            'atividades' => $query->latest()
                ->get()
                ->map(fn (Atividade $atividade) => $this->serializeAtividadeResumo($atividade, $user)),
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $userType = $user->userType->name;

        if (!in_array($userType, ['professor', 'admin', 'root'])) {
            abort(403, 'Você não tem permissão para criar atividades.');
        }

        return Inertia::render('Hub/Atividades/Create', [
            'turmas' => $this->availableTurmas($user),
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();
        $userType = $user->userType->name;

        if (!in_array($userType, ['professor', 'admin', 'root'])) {
            abort(403, 'Você não tem permissão para criar atividades.');
        }

        $validated = $this->validateAtividade($request, requireStructure: true);
        $turma = TurmaCriada::findOrFail($validated['turma_criada_id']);

        $this->ensureCanManageTurma($user, $turma);
        $this->ensureTurmaAberta($turma);

        $blocos = $this->normalizeBlocos($validated['blocos']);

        $atividade = DB::transaction(function () use ($validated, $turma, $blocos, $user, $userType) {
            $atividade = Atividade::create([
                'turma_criada_id' => $turma->id,
                'professor_id' => $userType === 'professor' ? $user->id : $turma->professor_id,
                'titulo' => $validated['titulo'],
                'descricao' => $validated['descricao'] ?? null,
                'instrucoes' => $validated['instrucoes'] ?? null,
                'nota_max' => $validated['nota_max'],
                'data_entrega' => $validated['data_entrega'] ?? null,
            ]);

            $this->syncBlocos($atividade, $blocos);
            $this->syncAtividadeAlunos($atividade, $turma);

            return $atividade;
        });

        return redirect()
            ->route('hub.atividades.show', $atividade->id)
            ->with('success', 'Atividade criada com sucesso.');
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $atividade = Atividade::with([
            'turmaCriada.turma',
            'turmaCriada.professor',
            'professor',
            'blocos',
            'atividadeAlunos.aluno',
            'atividadeAlunos.respostas',
        ])->findOrFail($id);

        if (!$atividade->canAccess($user)) {
            abort(403, 'Você não tem permissão para acessar esta atividade.');
        }

        $data = [
            'atividade' => $this->serializeAtividadeDetalhe($atividade, $user),
        ];

        if ($user->userType->name === 'aluno') {
            $atividadeAluno = $atividade->atividadeAlunos->firstWhere('aluno_id', $user->id);

            $data['atividadeAluno'] = $atividadeAluno
                ? $this->serializeAtividadeAluno($atividadeAluno)
                : null;
            $data['respostasAluno'] = $atividadeAluno
                ? $atividadeAluno->respostas->mapWithKeys(fn (AtividadeResposta $resposta) => [
                    $resposta->atividade_bloco_id => $resposta->resposta,
                ])
                : [];
        }

        if ($atividade->canManage($user)) {
            $data['estatisticas'] = $this->serializeEstatisticas($atividade);
            $data['alunos'] = $atividade->atividadeAlunos
                ->sortBy(fn (AtividadeAluno $atividadeAluno) => $atividadeAluno->aluno?->name)
                ->values()
                ->map(fn (AtividadeAluno $atividadeAluno) => $this->serializeAtividadeAluno($atividadeAluno));
        }

        return Inertia::render('Hub/Atividades/Show', $data);
    }

    public function edit(Request $request, $id)
    {
        $user = $request->user();
        $atividade = Atividade::with(['turmaCriada.turma', 'turmaCriada.professor', 'professor', 'blocos'])
            ->findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para editar esta atividade.');
        }

        return Inertia::render('Hub/Atividades/Edit', [
            'atividade' => $this->serializeAtividadeDetalhe($atividade, $user),
            'turmas' => $this->availableTurmas($user),
            'canEditStructure' => !$atividade->hasEntregas(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $atividade = Atividade::with(['turmaCriada', 'atividadeAlunos'])->findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para editar esta atividade.');
        }

        $hasEntregas = $atividade->hasEntregas();
        $validated = $this->validateAtividade($request, requireStructure: !$hasEntregas);

        if ($atividade->atividadeAlunos()
            ->whereNotNull('nota_total')
            ->where('nota_total', '>', $validated['nota_max'])
            ->exists()) {
            return back()
                ->withErrors(['nota_max' => 'A nota máxima não pode ser menor que uma nota já lançada.'])
                ->withInput();
        }

        if ($hasEntregas) {
            $atividade->update([
                'titulo' => $validated['titulo'],
                'descricao' => $validated['descricao'] ?? null,
                'instrucoes' => $validated['instrucoes'] ?? null,
                'nota_max' => $validated['nota_max'],
                'data_entrega' => $validated['data_entrega'] ?? null,
            ]);

            return redirect()
                ->route('hub.atividades.show', $atividade->id)
                ->with('success', 'Dados gerais da atividade atualizados. Os blocos não foram alterados porque já há entrega.');
        }

        $turma = TurmaCriada::findOrFail($validated['turma_criada_id']);
        $this->ensureCanManageTurma($user, $turma);
        $this->ensureTurmaAberta($turma);
        $blocos = $this->normalizeBlocos($validated['blocos']);

        DB::transaction(function () use ($atividade, $validated, $turma, $blocos) {
            $atividade->update([
                'turma_criada_id' => $turma->id,
                'professor_id' => $turma->professor_id,
                'titulo' => $validated['titulo'],
                'descricao' => $validated['descricao'] ?? null,
                'instrucoes' => $validated['instrucoes'] ?? null,
                'nota_max' => $validated['nota_max'],
                'data_entrega' => $validated['data_entrega'] ?? null,
            ]);

            $this->syncBlocos($atividade, $blocos);
            $this->syncAtividadeAlunos($atividade, $turma);
        });

        return redirect()
            ->route('hub.atividades.show', $atividade->id)
            ->with('success', 'Atividade atualizada com sucesso.');
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $atividade = Atividade::findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para excluir esta atividade.');
        }

        if ($atividade->hasEntregas()) {
            return back()->withErrors(['error' => 'Não é possível excluir uma atividade que já possui entregas.']);
        }

        $atividade->delete();

        return redirect()
            ->route('hub.atividades.index')
            ->with('success', 'Atividade excluída com sucesso.');
    }

    public function submeter(Request $request, $id)
    {
        $user = $request->user();

        if ($user->userType->name !== 'aluno') {
            abort(403, 'Apenas alunos podem entregar atividades.');
        }

        $atividade = Atividade::with(['blocos', 'atividadeAlunos' => fn ($query) => $query->where('aluno_id', $user->id)])
            ->findOrFail($id);

        if (!$atividade->canAccess($user)) {
            abort(403, 'Você não tem acesso a esta atividade.');
        }

        $atividadeAluno = $atividade->atividadeAlunos->first();

        if (!$atividadeAluno) {
            abort(403, 'Esta atividade não está vinculada ao seu usuário.');
        }

        if ($atividadeAluno->status === AtividadeAluno::STATUS_ENTREGUE) {
            return back()->withErrors(['error' => 'Esta atividade já foi entregue.']);
        }

        $respostas = $this->normalizeRespostas($request->input('respostas', []), $atividade->blocos);

        DB::transaction(function () use ($atividadeAluno, $respostas) {
            foreach ($respostas as $atividadeBlocoId => $resposta) {
                AtividadeResposta::updateOrCreate(
                    [
                        'atividade_aluno_id' => $atividadeAluno->id,
                        'atividade_bloco_id' => $atividadeBlocoId,
                    ],
                    ['resposta' => $resposta]
                );
            }

            $atividadeAluno->update([
                'status' => AtividadeAluno::STATUS_ENTREGUE,
                'data_submissao' => now(),
            ]);
        });

        return back()->with('success', 'Atividade entregue com sucesso.');
    }

    public function atualizarNota(Request $request, $id, $alunoId)
    {
        $user = $request->user();
        $atividade = Atividade::with('turmaCriada')->findOrFail($id);

        if (!$atividade->canManage($user)) {
            abort(403, 'Você não tem permissão para lançar nota nesta atividade.');
        }

        $atividadeAluno = AtividadeAluno::where('atividade_id', $atividade->id)
            ->where('aluno_id', $alunoId)
            ->firstOrFail();

        if ($atividadeAluno->status !== AtividadeAluno::STATUS_ENTREGUE) {
            return back()->withErrors(['nota_total' => 'Só é possível lançar nota após a entrega do aluno.']);
        }

        $validated = $request->validate([
            'nota_total' => ['nullable', 'numeric', 'min:0', 'max:' . $atividade->nota_max],
        ]);

        $atividadeAluno->update([
            'nota_total' => $validated['nota_total'] ?? null,
        ]);

        return back()->with('success', 'Nota atualizada com sucesso.');
    }

    private function validateAtividade(Request $request, bool $requireStructure): array
    {
        $rules = [
            'titulo' => ['required', 'string', 'max:255'],
            'descricao' => ['nullable', 'string'],
            'instrucoes' => ['nullable', 'string'],
            'nota_max' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'data_entrega' => ['nullable', 'date'],
        ];

        if ($requireStructure) {
            $rules = array_merge($rules, [
                'turma_criada_id' => ['required', 'exists:turmas_criadas,id'],
                'blocos' => ['required', 'array', 'min:1'],
                'blocos.*.tipo' => ['required', Rule::in(AtividadeBloco::TIPOS)],
                'blocos.*.ordem' => ['required', 'integer', 'min:1'],
                'blocos.*.titulo' => ['nullable', 'string', 'max:255'],
                'blocos.*.conteudo' => ['required', 'array'],
            ]);
        }

        return $request->validate($rules);
    }

    private function normalizeBlocos(array $blocos): array
    {
        $normalizados = [];

        foreach (array_values($blocos) as $index => $bloco) {
            $tipo = $bloco['tipo'] ?? null;
            $conteudo = $bloco['conteudo'] ?? [];
            $fieldPrefix = "blocos.{$index}.conteudo";

            $normalizados[] = [
                'tipo' => $tipo,
                'ordem' => $index + 1,
                'titulo' => $bloco['titulo'] ?? null,
                'conteudo' => $this->normalizeConteudoBloco($tipo, $conteudo, $fieldPrefix),
            ];
        }

        return $normalizados;
    }

    private function normalizeConteudoBloco(?string $tipo, array $conteudo, string $fieldPrefix): array
    {
        if (in_array($tipo, [AtividadeBloco::TIPO_TRADUCAO, AtividadeBloco::TIPO_COMPLETE])) {
            $texto = trim((string) ($conteudo['texto'] ?? ''));

            if ($texto === '') {
                throw ValidationException::withMessages([
                    "{$fieldPrefix}.texto" => 'Informe o texto do bloco.',
                ]);
            }

            return ['texto' => $texto];
        }

        if ($tipo === AtividadeBloco::TIPO_PERGUNTA_RESPOSTA) {
            $perguntas = collect($conteudo['perguntas'] ?? [])
                ->map(fn ($pergunta) => trim((string) $pergunta))
                ->filter()
                ->values()
                ->all();

            if (empty($perguntas)) {
                throw ValidationException::withMessages([
                    "{$fieldPrefix}.perguntas" => 'Informe pelo menos uma pergunta.',
                ]);
            }

            return ['perguntas' => $perguntas];
        }

        if ($tipo === AtividadeBloco::TIPO_ALTERNATIVA) {
            $perguntas = [];

            foreach (($conteudo['perguntas'] ?? []) as $perguntaIndex => $pergunta) {
                $enunciado = trim((string) ($pergunta['pergunta'] ?? ''));
                $opcoes = collect($pergunta['opcoes'] ?? [])
                    ->map(fn ($opcao) => trim((string) $opcao))
                    ->filter()
                    ->values()
                    ->all();

                if ($enunciado === '' && empty($opcoes)) {
                    continue;
                }

                if ($enunciado === '' || count($opcoes) < 2) {
                    throw ValidationException::withMessages([
                        "{$fieldPrefix}.perguntas.{$perguntaIndex}" => 'Cada pergunta de alternativa precisa de enunciado e pelo menos duas opções.',
                    ]);
                }

                $perguntas[] = [
                    'pergunta' => $enunciado,
                    'opcoes' => $opcoes,
                ];
            }

            if (empty($perguntas)) {
                throw ValidationException::withMessages([
                    "{$fieldPrefix}.perguntas" => 'Informe pelo menos uma pergunta de alternativa.',
                ]);
            }

            return ['perguntas' => $perguntas];
        }

        throw ValidationException::withMessages([
            $fieldPrefix => 'Tipo de bloco inválido.',
        ]);
    }

    private function normalizeRespostas(array $respostas, Collection $blocos): array
    {
        $normalizadas = [];
        $erros = [];

        foreach ($blocos as $bloco) {
            $payload = $respostas[$bloco->id] ?? $respostas[(string) $bloco->id] ?? null;
            $fieldPrefix = "respostas.{$bloco->id}";

            if (!is_array($payload)) {
                $erros[$fieldPrefix] = 'Responda este bloco.';
                continue;
            }

            $normalizadas[$bloco->id] = $this->normalizeRespostaBloco($bloco, $payload, $fieldPrefix);
        }

        if (!empty($erros)) {
            throw ValidationException::withMessages($erros);
        }

        return $normalizadas;
    }

    private function normalizeRespostaBloco(AtividadeBloco $bloco, array $payload, string $fieldPrefix): array
    {
        if (in_array($bloco->tipo, [AtividadeBloco::TIPO_TRADUCAO, AtividadeBloco::TIPO_COMPLETE])) {
            $texto = trim((string) ($payload['texto'] ?? ''));

            if ($texto === '') {
                throw ValidationException::withMessages([
                    "{$fieldPrefix}.texto" => 'Informe sua resposta.',
                ]);
            }

            return ['texto' => $texto];
        }

        if ($bloco->tipo === AtividadeBloco::TIPO_PERGUNTA_RESPOSTA) {
            $respostas = [];
            $perguntas = $bloco->conteudo['perguntas'] ?? [];

            foreach ($perguntas as $index => $pergunta) {
                $texto = trim((string) ($payload['respostas'][$index]['resposta'] ?? ''));

                if ($texto === '') {
                    throw ValidationException::withMessages([
                        "{$fieldPrefix}.respostas.{$index}.resposta" => 'Responda todas as perguntas.',
                    ]);
                }

                $respostas[] = [
                    'pergunta_index' => $index,
                    'resposta' => $texto,
                ];
            }

            return ['respostas' => $respostas];
        }

        if ($bloco->tipo === AtividadeBloco::TIPO_ALTERNATIVA) {
            $respostas = [];
            $perguntas = $bloco->conteudo['perguntas'] ?? [];

            foreach ($perguntas as $index => $pergunta) {
                $selected = $payload['respostas'][$index]['opcao_selecionada_index'] ?? null;

                if ($selected === null || $selected === '') {
                    throw ValidationException::withMessages([
                        "{$fieldPrefix}.respostas.{$index}.opcao_selecionada_index" => 'Selecione uma opção em todas as perguntas.',
                    ]);
                }

                $selected = (int) $selected;
                $opcoes = $pergunta['opcoes'] ?? [];

                if (!array_key_exists($selected, $opcoes)) {
                    throw ValidationException::withMessages([
                        "{$fieldPrefix}.respostas.{$index}.opcao_selecionada_index" => 'Opção selecionada inválida.',
                    ]);
                }

                $respostas[] = [
                    'pergunta_index' => $index,
                    'opcao_selecionada_index' => $selected,
                ];
            }

            return ['respostas' => $respostas];
        }

        throw ValidationException::withMessages([
            $fieldPrefix => 'Tipo de bloco inválido.',
        ]);
    }

    private function syncBlocos(Atividade $atividade, array $blocos): void
    {
        $atividade->blocos()->delete();

        foreach ($blocos as $bloco) {
            $atividade->blocos()->create($bloco);
        }
    }

    private function syncAtividadeAlunos(Atividade $atividade, TurmaCriada $turma): void
    {
        $atividade->atividadeAlunos()->delete();

        $now = now();
        $registros = collect($turma->alunos ?? [])
            ->map(fn ($alunoId) => (int) $alunoId)
            ->filter()
            ->unique()
            ->map(fn ($alunoId) => [
                'atividade_id' => $atividade->id,
                'aluno_id' => $alunoId,
                'status' => AtividadeAluno::STATUS_PENDENTE,
                'data_submissao' => null,
                'nota_total' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ])
            ->values()
            ->all();

        if (!empty($registros)) {
            AtividadeAluno::insert($registros);
        }
    }

    private function availableTurmas(User $user): Collection
    {
        $userType = $user->userType->name;

        return TurmaCriada::with(['turma', 'professor'])
            ->when($userType === 'professor', fn ($query) => $query->where('professor_id', $user->id))
            ->where('status', '!=', 'encerrada')
            ->orderBy('status')
            ->latest()
            ->get()
            ->map(fn (TurmaCriada $turma) => $this->serializeTurma($turma));
    }

    private function ensureCanManageTurma(User $user, TurmaCriada $turma): void
    {
        $userType = $user->userType->name;

        if (in_array($userType, ['root', 'admin'])) {
            return;
        }

        if ($userType === 'professor' && $turma->professor_id === $user->id) {
            return;
        }

        abort(403, 'Você não tem permissão para gerenciar atividades nesta turma.');
    }

    private function ensureTurmaAberta(TurmaCriada $turma): void
    {
        if ($turma->status === 'em andamento') {
            return;
        }

        throw ValidationException::withMessages([
            'turma_criada_id' => 'Não é possível criar ou alterar atividades para turmas bloqueadas ou encerradas.',
        ]);
    }

    private function serializeAtividadeResumo(Atividade $atividade, User $user): array
    {
        $minhaEntrega = $atividade->relationLoaded('atividadeAlunos')
            ? $atividade->atividadeAlunos->firstWhere('aluno_id', $user->id)
            : null;

        return [
            'id' => $atividade->id,
            'titulo' => $atividade->titulo,
            'descricao' => $atividade->descricao,
            'instrucoes' => $atividade->instrucoes,
            'nota_max' => $atividade->nota_max,
            'data_entrega' => optional($atividade->data_entrega)->toIso8601String(),
            'turma_criada' => $this->serializeTurma($atividade->turmaCriada),
            'professor' => $this->serializeUser($atividade->professor),
            'total_alunos_count' => $atividade->total_alunos_count ?? 0,
            'pendentes_count' => $atividade->pendentes_count ?? 0,
            'entregues_count' => $atividade->entregues_count ?? 0,
            'minha_entrega' => $minhaEntrega ? $this->serializeAtividadeAluno($minhaEntrega) : null,
        ];
    }

    private function serializeAtividadeDetalhe(Atividade $atividade, User $user): array
    {
        return [
            'id' => $atividade->id,
            'turma_criada_id' => $atividade->turma_criada_id,
            'professor_id' => $atividade->professor_id,
            'titulo' => $atividade->titulo,
            'descricao' => $atividade->descricao,
            'instrucoes' => $atividade->instrucoes,
            'nota_max' => $atividade->nota_max,
            'data_entrega' => optional($atividade->data_entrega)->toIso8601String(),
            'turma_criada' => $this->serializeTurma($atividade->turmaCriada),
            'professor' => $this->serializeUser($atividade->professor),
            'blocos' => $atividade->blocos->map(fn (AtividadeBloco $bloco) => [
                'id' => $bloco->id,
                'tipo' => $bloco->tipo,
                'ordem' => $bloco->ordem,
                'titulo' => $bloco->titulo,
                'conteudo' => $bloco->conteudo,
            ])->values(),
            'pode_editar' => $atividade->canEdit($user),
            'pode_editar_estrutura' => $atividade->canEdit($user) && !$atividade->hasEntregas(),
        ];
    }

    private function serializeAtividadeAluno(AtividadeAluno $atividadeAluno): array
    {
        return [
            'id' => $atividadeAluno->id,
            'atividade_id' => $atividadeAluno->atividade_id,
            'aluno_id' => $atividadeAluno->aluno_id,
            'aluno' => $this->serializeUser($atividadeAluno->aluno),
            'status' => $atividadeAluno->status,
            'data_submissao' => optional($atividadeAluno->data_submissao)->toIso8601String(),
            'nota_total' => $atividadeAluno->nota_total,
        ];
    }

    private function serializeEstatisticas(Atividade $atividade): array
    {
        return [
            'total_alunos' => $atividade->atividadeAlunos->count(),
            'pendentes' => $atividade->atividadeAlunos->where('status', AtividadeAluno::STATUS_PENDENTE)->count(),
            'entregues' => $atividade->atividadeAlunos->where('status', AtividadeAluno::STATUS_ENTREGUE)->count(),
        ];
    }

    private function serializeTurma(?TurmaCriada $turma): ?array
    {
        if (!$turma) {
            return null;
        }

        return [
            'id' => $turma->id,
            'status' => $turma->status,
            'total_alunos' => count($turma->alunos ?? []),
            'turma' => [
                'id' => $turma->turma?->id,
                'nome' => $turma->turma->nome ?? "Turma #{$turma->id}",
            ],
            'professor' => $this->serializeUser($turma->professor),
        ];
    }

    private function serializeUser(?User $user): ?array
    {
        if (!$user) {
            return null;
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
    }
}
