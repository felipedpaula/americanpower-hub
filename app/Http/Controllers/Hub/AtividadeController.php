<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Atividade;
use App\Models\AtividadeAluno;
use App\Models\AtividadeTipo;
use App\Models\QuestaoAtividade;
use App\Models\QuestaoAtividadeAluno;
use App\Models\TurmaCriada;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class AtividadeController extends Controller
{
    /**
     * Lista todas as atividades acessíveis pelo usuário
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $userType = $user->userType->name;

        $query = Atividade::with(['tipo', 'turma.turma', 'turma.professor']);

        if ($userType === 'professor') {
            // Professor vê apenas atividades de suas turmas
            $query->whereHas('turma', function ($q) use ($user) {
                $q->where('professor_id', $user->id);
            });
        } elseif ($userType === 'aluno') {
            // Aluno vê apenas atividades das turmas em que está matriculado
            $turmaIds = TurmaCriada::whereJsonContains('alunos', (string)$user->id)
                ->orWhereJsonContains('alunos', $user->id)
                ->pluck('id');
            $query->whereIn('turma_id', $turmaIds);
        }
        // Admin e Root veem todas

        $atividades = $query->orderBy('created_at', 'desc')->get();

        // Para alunos, incluir status de cada atividade
        if ($userType === 'aluno') {
            $atividades->load(['atividadeAlunos' => function ($q) use ($user) {
                $q->where('aluno_id', $user->id);
            }]);
        }

        return Inertia::render('Hub/Atividades/Index', [
            'atividades' => $atividades,
        ]);
    }

    /**
     * Exibe o formulário de criação de atividade
     */
    public function create()
    {
        $user = auth()->user();
        $userType = $user->userType->name;

        // Apenas professores, admin e root podem criar
        if (!in_array($userType, ['professor', 'admin', 'root'])) {
            abort(403, 'Você não tem permissão para criar atividades.');
        }

        // Busca turmas do professor
        $turmas = TurmaCriada::with('turma')
            ->when($userType === 'professor', function ($q) use ($user) {
                $q->where('professor_id', $user->id);
            })
            ->where('status', 'em andamento')
            ->get();

        $tipos = AtividadeTipo::all();

        return Inertia::render('Hub/Atividades/Create', [
            'turmas' => $turmas,
            'tipos' => $tipos,
        ]);
    }

    /**
     * Armazena uma nova atividade
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        $userType = $user->userType->name;

        if (!in_array($userType, ['professor', 'admin', 'root'])) {
            abort(403, 'Você não tem permissão para criar atividades.');
        }

        $validated = $request->validate([
            'tipo_id' => 'required|exists:atividade_tipos,id',
            'turma_id' => 'required|exists:turmas_criadas,id',
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'nota_max' => 'required|numeric|min:0|max:999999.99',
            'data_entrega' => 'nullable|date',
        ]);

        // Verifica se o professor tem permissão sobre a turma
        if ($userType === 'professor') {
            $turma = TurmaCriada::findOrFail($validated['turma_id']);
            if ($turma->professor_id !== $user->id) {
                abort(403, 'Você não tem permissão para criar atividades nesta turma.');
            }
        }

        DB::beginTransaction();
        try {
            $atividade = Atividade::create($validated);

            // Criar registros para todos os alunos da turma
            $turma = TurmaCriada::findOrFail($validated['turma_id']);
            $alunos = $turma->alunos ?? [];
            
            $atividadesAlunoData = [];
            foreach ($alunos as $alunoId) {
                $atividadesAlunoData[] = [
                    'atividade_id' => $atividade->id,
                    'aluno_id' => (int)$alunoId,
                    'status' => 'pendente',
                    'nota_total' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if (!empty($atividadesAlunoData)) {
                AtividadeAluno::insert($atividadesAlunoData);
            }

            DB::commit();

            return redirect()->route('hub.atividades.show', $atividade->id)
                ->with('success', 'Atividade criada com sucesso!');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erro ao criar atividade: ' . $e->getMessage()]);
        }
    }

    /**
     * Exibe uma atividade específica
     */
    public function show($id)
    {
        $user = auth()->user();
        $atividade = Atividade::with([
            'tipo',
            'turma.turma',
            'turma.professor',
            'questoes' => function ($q) {
                $q->orderBy('created_at', 'asc');
            }
        ])->findOrFail($id);

        // Verifica permissão de acesso
        if (!$atividade->canAccess($user)) {
            abort(403, 'Você não tem permissão para acessar esta atividade.');
        }

        $data = ['atividade' => $atividade];

        // Se for aluno, carrega suas respostas
        if ($user->userType->name === 'aluno') {
            $atividadeAluno = AtividadeAluno::where('atividade_id', $id)
                ->where('aluno_id', $user->id)
                ->first();

            $respostasAluno = QuestaoAtividadeAluno::where('aluno_id', $user->id)
                ->whereIn('questao_id', $atividade->questoes->pluck('id'))
                ->get()
                ->keyBy('questao_id');

            $data['atividadeAluno'] = $atividadeAluno;
            $data['respostasAluno'] = $respostasAluno;
        }

        // Se for professor ou admin, carrega estatísticas
        if (in_array($user->userType->name, ['professor', 'admin', 'root'])) {
            $data['estatisticas'] = [
                'total_alunos' => AtividadeAluno::where('atividade_id', $id)->count(),
                'enviados' => AtividadeAluno::where('atividade_id', $id)->where('status', 'enviado')->count(),
                'corrigidos' => AtividadeAluno::where('atividade_id', $id)->where('status', 'corrigido')->count(),
                'pendentes' => AtividadeAluno::where('atividade_id', $id)->where('status', 'pendente')->count(),
            ];
        }

        return Inertia::render('Hub/Atividades/Show', $data);
    }

    /**
     * Exibe formulário de edição
     */
    public function edit($id)
    {
        $user = auth()->user();
        $atividade = Atividade::with(['tipo', 'turma'])->findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para editar esta atividade.');
        }

        $userType = $user->userType->name;
        $turmas = TurmaCriada::with('turma')
            ->when($userType === 'professor', function ($q) use ($user) {
                $q->where('professor_id', $user->id);
            })
            ->where('status', 'em andamento')
            ->get();

        $tipos = AtividadeTipo::all();

        return Inertia::render('Hub/Atividades/Edit', [
            'atividade' => $atividade,
            'turmas' => $turmas,
            'tipos' => $tipos,
        ]);
    }

    /**
     * Atualiza uma atividade
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $atividade = Atividade::findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para editar esta atividade.');
        }

        $validated = $request->validate([
            'tipo_id' => 'required|exists:atividade_tipos,id',
            'turma_id' => 'required|exists:turmas_criadas,id',
            'titulo' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'nota_max' => 'required|numeric|min:0|max:999999.99',
            'data_entrega' => 'nullable|date',
        ]);

        // Verifica se o professor tem permissão sobre a turma
        if ($user->userType->name === 'professor') {
            $turma = TurmaCriada::findOrFail($validated['turma_id']);
            if ($turma->professor_id !== $user->id) {
                abort(403, 'Você não tem permissão para mover esta atividade para esta turma.');
            }
        }

        $atividade->update($validated);

        return redirect()->route('hub.atividades.show', $atividade->id)
            ->with('success', 'Atividade atualizada com sucesso!');
    }

    /**
     * Remove uma atividade
     */
    public function destroy($id)
    {
        $user = auth()->user();
        $atividade = Atividade::findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para excluir esta atividade.');
        }

        $atividade->delete();

        return redirect()->route('hub.atividades.index')
            ->with('success', 'Atividade excluída com sucesso!');
    }

    /**
     * Exibe formulário para criação de questão
     */
    public function createQuestao($id)
    {
        $user = auth()->user();
        $atividade = Atividade::with(['turma.turma'])->findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para adicionar questões a esta atividade.');
        }

        return Inertia::render('Hub/Atividades/Questoes/Create', [
            'atividade' => [
                'id' => $atividade->id,
                'titulo' => $atividade->titulo,
                'nota_max' => $atividade->nota_max,
                'turma' => [
                    'nome' => $atividade->turma->turma->nome ?? null,
                ],
            ],
        ]);
    }

    /**
     * Adiciona uma questão à atividade
     */
    public function addQuestao(Request $request, $id)
    {
        $user = auth()->user();
        $atividade = Atividade::findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para adicionar questões a esta atividade.');
        }

        $validated = $request->validate([
            'enunciado' => 'required|string',
            'valor' => 'required|numeric|min:0|max:999999.99',
        ]);

        DB::beginTransaction();
        try {
            $questao = QuestaoAtividade::create([
                'atividade_id' => $id,
                'enunciado' => $validated['enunciado'],
                'valor' => $validated['valor'],
                'status' => 'ativa',
            ]);

            // Criar registros vazios para todos os alunos usando batch insert
            $alunoIds = AtividadeAluno::where('atividade_id', $id)->pluck('aluno_id');
            $respostasData = [];
            foreach ($alunoIds as $alunoId) {
                $respostasData[] = [
                    'questao_id' => $questao->id,
                    'aluno_id' => (int)$alunoId,
                    'status' => 'em_branco',
                    'nota_obtida' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            if (!empty($respostasData)) {
                QuestaoAtividadeAluno::insert($respostasData);
            }

            DB::commit();

            return back()->with('success', 'Questão adicionada com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erro ao adicionar questão: ' . $e->getMessage()]);
        }
    }

    /**
     * Atualiza uma questão
     */
    public function updateQuestao(Request $request, $id, $questaoId)
    {
        $user = auth()->user();
        $atividade = Atividade::findOrFail($id);
        $questao = QuestaoAtividade::where('atividade_id', $id)->findOrFail($questaoId);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para editar questões desta atividade.');
        }

        $validated = $request->validate([
            'enunciado' => 'required|string',
            'valor' => 'required|numeric|min:0|max:999999.99',
            'status' => ['required', Rule::in(['ativa', 'anulada'])],
        ]);

        try {
            $questao->update($validated);
            return back()->with('success', 'Questão atualizada com sucesso!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erro ao atualizar questão: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove uma questão
     */
    public function destroyQuestao($id, $questaoId)
    {
        $user = auth()->user();
        $atividade = Atividade::findOrFail($id);
        $questao = QuestaoAtividade::where('atividade_id', $id)->findOrFail($questaoId);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para excluir questões desta atividade.');
        }

        $questao->delete();

        return back()->with('success', 'Questão excluída com sucesso!');
    }

    /**
     * Aluno responde uma questão
     */
    public function responderQuestao(Request $request, $id, $questaoId)
    {
        $user = auth()->user();

        if ($user->userType->name !== 'aluno') {
            abort(403, 'Apenas alunos podem responder questões.');
        }

        $atividade = Atividade::findOrFail($id);
        if (!$atividade->canAccess($user)) {
            abort(403, 'Você não tem acesso a esta atividade.');
        }

        $questao = QuestaoAtividade::where('atividade_id', $id)->findOrFail($questaoId);

        $validated = $request->validate([
            'resposta' => 'required|string',
        ]);

        $respostaAluno = QuestaoAtividadeAluno::where('questao_id', $questaoId)
            ->where('aluno_id', $user->id)
            ->first();

        if ($respostaAluno) {
            $respostaAluno->update([
                'resposta' => $validated['resposta'],
                'status' => 'respondida',
            ]);
        } else {
            QuestaoAtividadeAluno::create([
                'questao_id' => $questaoId,
                'aluno_id' => $user->id,
                'resposta' => $validated['resposta'],
                'status' => 'respondida',
                'nota_obtida' => 0,
            ]);
        }

        return back()->with('success', 'Resposta salva com sucesso!');
    }

    /**
     * Aluno submete a atividade completa
     */
    public function submeter($id)
    {
        $user = auth()->user();

        if ($user->userType->name !== 'aluno') {
            abort(403, 'Apenas alunos podem submeter atividades.');
        }

        $atividade = Atividade::findOrFail($id);
        if (!$atividade->canAccess($user)) {
            abort(403, 'Você não tem acesso a esta atividade.');
        }

        $atividadeAluno = AtividadeAluno::where('atividade_id', $id)
            ->where('aluno_id', $user->id)
            ->firstOrFail();

        if ($atividadeAluno->status === 'enviado' || $atividadeAluno->status === 'corrigido') {
            return back()->withErrors(['error' => 'Esta atividade já foi submetida.']);
        }

        $atividadeAluno->update([
            'status' => 'enviado',
            'data_submissao' => now(),
        ]);

        return back()->with('success', 'Atividade submetida com sucesso!');
    }

    /**
     * Professor corrige uma questão de um aluno
     */
    public function corrigirQuestao(Request $request, $id, $alunoId, $questaoId)
    {
        $user = auth()->user();
        $atividade = Atividade::findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para corrigir esta atividade.');
        }

        $validated = $request->validate([
            'nota_obtida' => 'required|numeric|min:0',
        ]);

        $respostaAluno = QuestaoAtividadeAluno::where('questao_id', $questaoId)
            ->where('aluno_id', $alunoId)
            ->firstOrFail();

        $respostaAluno->update([
            'nota_obtida' => $validated['nota_obtida'],
        ]);

        return back()->with('success', 'Questão corrigida com sucesso!');
    }

    /**
     * Professor finaliza a correção de uma atividade para um aluno
     */
    public function finalizarCorrecao(Request $request, $id, $alunoId)
    {
        $user = auth()->user();
        $atividade = Atividade::findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para corrigir esta atividade.');
        }

        $validated = $request->validate([
            'comentario_professor' => 'nullable|string',
        ]);

        $atividadeAluno = AtividadeAluno::where('atividade_id', $id)
            ->where('aluno_id', $alunoId)
            ->firstOrFail();

        $atividadeAluno->update([
            'status' => 'corrigido',
            'data_correcao' => now(),
            'comentario_professor' => $validated['comentario_professor'] ?? null,
        ]);

        return back()->with('success', 'Correção finalizada com sucesso!');
    }

    /**
     * Lista submissões dos alunos para uma atividade (para professores)
     */
    public function submissoes($id)
    {
        $user = auth()->user();
        $atividade = Atividade::with(['tipo', 'turma'])->findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para ver as submissões desta atividade.');
        }

        $submissoes = AtividadeAluno::where('atividade_id', $id)
            ->with('aluno')
            ->orderBy('status', 'desc')
            ->orderBy('data_submissao', 'desc')
            ->get();

        return Inertia::render('Hub/Atividades/Submissoes', [
            'atividade' => $atividade,
            'submissoes' => $submissoes,
        ]);
    }

    /**
     * Visualiza a submissão de um aluno específico
     */
    public function visualizarSubmissao($id, $alunoId)
    {
        $user = auth()->user();
        $atividade = Atividade::with(['tipo', 'turma', 'questoes'])->findOrFail($id);

        if (!$atividade->canEdit($user)) {
            abort(403, 'Você não tem permissão para ver esta submissão.');
        }

        $atividadeAluno = AtividadeAluno::where('atividade_id', $id)
            ->where('aluno_id', $alunoId)
            ->with('aluno')
            ->firstOrFail();

        $respostas = QuestaoAtividadeAluno::where('aluno_id', $alunoId)
            ->whereIn('questao_id', $atividade->questoes->pluck('id'))
            ->get()
            ->keyBy('questao_id');

        return Inertia::render('Hub/Atividades/VisualizarSubmissao', [
            'atividade' => $atividade,
            'atividadeAluno' => $atividadeAluno,
            'respostas' => $respostas,
        ]);
    }
}
