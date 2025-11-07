<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\FinanceiroAluno;
use App\Models\TurmaCriada;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FinanceiroAlunoController extends Controller
{
    private const STATUS_LABELS = [
        'aberto' => 'Em aberto',
        'pago' => 'Pago',
        'atrasado' => 'Em atraso',
        'isento' => 'Isento',
    ];

    public function index(): Response
    {
        $alunos = User::with('userType')
            ->whereHas('userType', fn ($query) => $query->where('name', 'aluno'))
            ->orderBy('name')
            ->get();

        $turmas = TurmaCriada::with('turma')->get();
        $financeirosPorAluno = FinanceiroAluno::whereIn('aluno_id', $alunos->pluck('id'))
            ->get()
            ->groupBy('aluno_id');

        $alunosFormatados = $alunos->map(function (User $aluno) use ($turmas, $financeirosPorAluno) {
            $turma = $this->buscarTurmaDoAluno($turmas, $aluno->id);
            $registrosFinanceiros = $financeirosPorAluno->get($aluno->id, collect());

            $temAtraso = $registrosFinanceiros->contains(function (FinanceiroAluno $registro) {
                if ($registro->status === 'atrasado') {
                    return true;
                }

                if ($registro->status === 'aberto' && $registro->data_vencimento && !$registro->valor_pago) {
                    return Carbon::parse($registro->data_vencimento)->isPast();
                }

                return false;
            });

            $financeiroStatus = $registrosFinanceiros->isEmpty()
                ? 'sem_registros'
                : ($temAtraso ? 'atrasado' : 'em_dia');

            return [
                'id' => $aluno->id,
                'name' => $aluno->name,
                'email' => $aluno->email,
                'status' => $aluno->status ? 'ativo' : 'inativo',
                'status_label' => $aluno->status ? 'Ativo' : 'Inativo',
                'turma' => $turma ? [
                    'id' => $turma->id,
                    'nome' => $turma->turma?->nome,
                    'status' => $turma->status,
                ] : null,
                'financeiro_status' => $financeiroStatus,
                'financeiro_status_label' => match ($financeiroStatus) {
                    'atrasado' => 'Com pendências',
                    'em_dia' => 'Em dia',
                    default => 'Sem registros',
                },
                'resumo' => [
                    'total_registros' => $registrosFinanceiros->count(),
                    'pagos' => $registrosFinanceiros->where('status', 'pago')->count(),
                    'atrasados' => $registrosFinanceiros->where('status', 'atrasado')->count(),
                ],
            ];
        })->values();

        return Inertia::render('CMS/Financeiro/Index', [
            'alunos' => $alunosFormatados,
        ]);
    }

    public function show(Request $request, User $aluno): Response
    {
        $this->assertAluno($aluno);

        $anoAtual = (int) $request->query('ano', now()->year);

        $financeiros = FinanceiroAluno::where('aluno_id', $aluno->id)->get();
        $anosDisponiveis = $financeiros->pluck('competencia')
            ->filter()
            ->map(fn ($competencia) => (int) substr($competencia, 0, 4))
            ->filter()
            ->unique()
            ->sort()
            ->values();

        if ($anosDisponiveis->isEmpty()) {
            $anosDisponiveis = collect([$anoAtual]);
        } elseif (!$anosDisponiveis->contains($anoAtual)) {
            $anosDisponiveis->push($anoAtual);
            $anosDisponiveis = $anosDisponiveis->unique()->sort()->values();
        }

        $registrosAno = $financeiros->filter(function (FinanceiroAluno $registro) use ($anoAtual) {
            return str_starts_with($registro->competencia, $anoAtual . '-');
        });

        $meses = collect(range(1, 12))->map(function (int $mes) use ($registrosAno, $anoAtual) {
            $competencia = sprintf('%04d-%02d', $anoAtual, $mes);
            $registro = $registrosAno->firstWhere('competencia', $competencia);
            $carbon = Carbon::createFromDate($anoAtual, $mes, 1)->locale('pt_BR');

            if ($registro) {
                $status = $registro->status;
            } else {
                $status = 'sem_registro';
            }

            return [
                'competencia' => $competencia,
                'mes' => $mes,
                'label' => ucfirst($carbon->translatedFormat('F')),
                'status' => $status,
                'status_label' => $status === 'sem_registro'
                    ? 'Sem lançamento'
                    : (self::STATUS_LABELS[$status] ?? ucfirst($status)),
                'valor_previsto' => $registro?->valor_previsto,
                'valor_pago' => $registro?->valor_pago,
                'data_vencimento' => optional($registro?->data_vencimento)->format('Y-m-d'),
                'data_pagamento' => optional($registro?->data_pagamento)->format('Y-m-d'),
            ];
        })->values();

        $temAtraso = $financeiros->contains(function (FinanceiroAluno $registro) {
            if ($registro->status === 'atrasado') {
                return true;
            }

            if ($registro->status === 'aberto' && $registro->data_vencimento && !$registro->valor_pago) {
                return Carbon::parse($registro->data_vencimento)->isPast();
            }

            return false;
        });

        $resumo = [
            'situacao' => $temAtraso ? 'atrasado' : 'em_dia',
            'mensagem' => $temAtraso
                ? 'O aluno possui mensalidades em atraso ou pendentes.'
                : 'Todas as mensalidades registradas estão em dia.',
            'totais' => [
                'previsto' => (float) $financeiros->sum('valor_previsto'),
                'pago' => (float) $financeiros->sum('valor_pago'),
            ],
            'contagem' => [
                'total' => $financeiros->count(),
                'abertos' => $financeiros->where('status', 'aberto')->count(),
                'pagos' => $financeiros->where('status', 'pago')->count(),
                'atrasados' => $financeiros->where('status', 'atrasado')->count(),
                'isentos' => $financeiros->where('status', 'isento')->count(),
            ],
        ];

        $turma = $this->buscarTurmaDoAluno(TurmaCriada::with('turma')->get(), $aluno->id);

        return Inertia::render('CMS/Financeiro/Show', [
            'aluno' => [
                'id' => $aluno->id,
                'name' => $aluno->name,
                'email' => $aluno->email,
                'status' => $aluno->status ? 'ativo' : 'inativo',
                'status_label' => $aluno->status ? 'Ativo' : 'Inativo',
                'turma' => $turma ? [
                    'id' => $turma->id,
                    'nome' => $turma->turma?->nome,
                    'status' => $turma->status,
                ] : null,
            ],
            'resumo' => $resumo,
            'anoAtual' => $anoAtual,
            'anosDisponiveis' => $anosDisponiveis,
            'meses' => $meses,
            'statusOptions' => $this->getStatusOptions(),
        ]);
    }

    public function showCompetencia(User $aluno, string $competencia): Response
    {
        $this->assertAluno($aluno);
        $competenciaCarbon = $this->parseCompetencia($competencia);

        $registro = FinanceiroAluno::where('aluno_id', $aluno->id)
            ->where('competencia', $competencia)
            ->first();

        return Inertia::render('CMS/Financeiro/Competencia', [
            'aluno' => [
                'id' => $aluno->id,
                'name' => $aluno->name,
            ],
            'competencia' => [
                'valor' => $competencia,
                'label' => ucfirst($competenciaCarbon->locale('pt_BR')->translatedFormat('F \d\e Y')),
            ],
            'registro' => $registro ? [
                'id' => $registro->id,
                'valor_previsto' => $registro->valor_previsto,
                'data_vencimento' => optional($registro->data_vencimento)->format('Y-m-d'),
                'valor_pago' => $registro->valor_pago,
                'data_pagamento' => optional($registro->data_pagamento)->format('Y-m-d'),
                'metodo' => $registro->metodo,
                'status' => $registro->status,
                'observacao' => $registro->observacao,
            ] : [
                'status' => 'aberto',
            ],
            'statusOptions' => $this->getStatusOptions(),
        ]);
    }

    public function updateCompetencia(Request $request, User $aluno, string $competencia): RedirectResponse
    {
        $this->assertAluno($aluno);
        $competenciaCarbon = $this->parseCompetencia($competencia);

        $validated = $request->validate([
            'valor_previsto' => ['nullable', 'numeric', 'min:0'],
            'data_vencimento' => ['nullable', 'date'],
            'valor_pago' => ['nullable', 'numeric', 'min:0'],
            'data_pagamento' => ['nullable', 'date'],
            'metodo' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(array_keys(self::STATUS_LABELS))],
            'observacao' => ['nullable', 'string'],
        ]);

        FinanceiroAluno::updateOrCreate(
            [
                'aluno_id' => $aluno->id,
                'competencia' => $competenciaCarbon->format('Y-m'),
            ],
            $validated
        );

        return redirect()
            ->route('cms.financeiro.alunos.competencias.show', [$aluno->id, $competenciaCarbon->format('Y-m')])
            ->with('success', 'Informações financeiras atualizadas com sucesso.');
    }

    private function assertAluno(User $aluno): void
    {
        if (!$aluno->relationLoaded('userType')) {
            $aluno->load('userType');
        }

        if (!$aluno->userType || $aluno->userType->name !== 'aluno') {
            abort(404);
        }
    }

    private function buscarTurmaDoAluno(Collection $turmas, int $alunoId): ?TurmaCriada
    {
        return $turmas->first(function (TurmaCriada $turma) use ($alunoId) {
            $alunosTurma = collect($turma->alunos ?? [])
                ->map(fn ($id) => (int) $id)
                ->filter()
                ->values();

            return $alunosTurma->contains($alunoId);
        });
    }

    private function getStatusOptions(): array
    {
        return collect(self::STATUS_LABELS)
            ->map(fn ($label, $value) => [
                'value' => $value,
                'label' => $label,
            ])
            ->values()
            ->all();
    }

    private function parseCompetencia(string $competencia): Carbon
    {
        try {
            return Carbon::createFromFormat('Y-m', $competencia)->startOfMonth();
        } catch (\Exception $exception) {
            abort(404);
        }
    }
}
