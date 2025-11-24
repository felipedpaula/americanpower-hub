<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\FinanceiroProfessor;
use App\Models\User;
use App\Support\Financeiro\FinanceiroTabs;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class FinanceiroProfessorController extends Controller
{
    private const STATUS_LABELS = [
        'aberto' => 'Em aberto',
        'pago' => 'Pago',
        'atrasado' => 'Em atraso',
        'isento' => 'Isento',
    ];
    private const DECIMO_TERCEIRO_MES = 13;

    public function index(): Response
    {
        $professores = User::with('userType')
            ->whereHas('userType', fn ($query) => $query->where('name', 'professor'))
            ->orderBy('name')
            ->get();

        $financeirosPorProfessor = FinanceiroProfessor::whereIn('professor_id', $professores->pluck('id'))
            ->get()
            ->groupBy('professor_id');

        $professoresFormatados = $professores->map(function (User $professor) use ($financeirosPorProfessor) {
            $registrosFinanceiros = $financeirosPorProfessor->get($professor->id, collect());

            $temAtraso = $registrosFinanceiros->contains(function (FinanceiroProfessor $registro) {
                if ($registro->status === 'atrasado') {
                    return true;
                }

                if ($registro->status === 'aberto' && $registro->data_prevista && !$registro->valor_pago) {
                    return Carbon::parse($registro->data_prevista)->isPast();
                }

                return false;
            });

            $financeiroStatus = $registrosFinanceiros->isEmpty()
                ? 'sem_registros'
                : ($temAtraso ? 'atrasado' : 'em_dia');

            return [
                'id' => $professor->id,
                'name' => $professor->name,
                'email' => $professor->email,
                'status' => $professor->status ? 'ativo' : 'inativo',
                'status_label' => $professor->status ? 'Ativo' : 'Inativo',
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

        return Inertia::render('CMS/Financeiro/Professores/Index', [
            'professores' => $professoresFormatados,
            'tabs' => FinanceiroTabs::build(auth()->user(), 'professores'),
        ]);
    }

    public function show(Request $request, User $professor): Response
    {
        $this->assertProfessor($professor);

        $anoAtual = (int) $request->query('ano', now()->year);

        $financeiros = FinanceiroProfessor::where('professor_id', $professor->id)->get();
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

        $registrosAno = $financeiros->filter(function (FinanceiroProfessor $registro) use ($anoAtual) {
            return str_starts_with($registro->competencia, $anoAtual . '-');
        });

        $meses = $this->montarCompetenciasDoAno($registrosAno, $anoAtual);

        $temAtraso = $financeiros->contains(function (FinanceiroProfessor $registro) {
            if ($registro->status === 'atrasado') {
                return true;
            }

            if ($registro->status === 'aberto' && $registro->data_prevista && !$registro->valor_pago) {
                return Carbon::parse($registro->data_prevista)->isPast();
            }

            return false;
        });

        $resumo = [
            'situacao' => $temAtraso ? 'atrasado' : 'em_dia',
            'mensagem' => $temAtraso
                ? 'Existem pagamentos previstos em atraso ou pendentes.'
                : 'Todos os lançamentos registrados estão em dia.',
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

        return Inertia::render('CMS/Financeiro/Professores/Show', [
            'professor' => [
                'id' => $professor->id,
                'name' => $professor->name,
                'email' => $professor->email,
                'status' => $professor->status ? 'ativo' : 'inativo',
                'status_label' => $professor->status ? 'Ativo' : 'Inativo',
            ],
            'resumo' => $resumo,
            'anoAtual' => $anoAtual,
            'anosDisponiveis' => $anosDisponiveis,
            'meses' => $meses,
            'statusOptions' => $this->getStatusOptions(),
            'tabs' => FinanceiroTabs::build(auth()->user(), 'professores'),
        ]);
    }

    public function showCompetencia(User $professor, string $competencia): Response
    {
        $this->assertProfessor($professor);
        $competenciaDados = $this->parseCompetencia($competencia);
        $competenciaValor = $this->formatCompetenciaValue($competenciaDados['ano'], $competenciaDados['mes']);

        $registro = FinanceiroProfessor::where('professor_id', $professor->id)
            ->where('competencia', $competenciaValor)
            ->first();

        return Inertia::render('CMS/Financeiro/Professores/Competencia', [
            'professor' => [
                'id' => $professor->id,
                'name' => $professor->name,
            ],
            'competencia' => [
                'valor' => $competenciaValor,
                'label' => $this->formatCompetenciaLabel($competenciaDados['ano'], $competenciaDados['mes']),
                'is_decimo_terceiro' => $competenciaDados['is_decimo_terceiro'],
            ],
            'registro' => $registro ? [
                'id' => $registro->id,
                'valor_previsto' => $registro->valor_previsto,
                'data_prevista' => optional($registro->data_prevista)->format('Y-m-d'),
                'valor_pago' => $registro->valor_pago,
                'data_pagamento' => optional($registro->data_pagamento)->format('Y-m-d'),
                'metodo' => $registro->metodo,
                'status' => $registro->status,
                'observacao' => $registro->observacao,
            ] : [
                'status' => 'aberto',
            ],
            'statusOptions' => $this->getStatusOptions(),
            'tabs' => FinanceiroTabs::build(auth()->user(), 'professores'),
        ]);
    }

    public function updateCompetencia(Request $request, User $professor, string $competencia): RedirectResponse
    {
        $this->assertProfessor($professor);
        $competenciaDados = $this->parseCompetencia($competencia);
        $competenciaValor = $this->formatCompetenciaValue($competenciaDados['ano'], $competenciaDados['mes']);

        $validated = $request->validate([
            'valor_previsto' => ['nullable', 'numeric', 'min:0'],
            'data_prevista' => ['nullable', 'date'],
            'valor_pago' => ['nullable', 'numeric', 'min:0'],
            'data_pagamento' => ['nullable', 'date'],
            'metodo' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(array_keys(self::STATUS_LABELS))],
            'observacao' => ['nullable', 'string'],
        ]);

        FinanceiroProfessor::updateOrCreate(
            [
                'professor_id' => $professor->id,
                'competencia' => $competenciaValor,
            ],
            $validated
        );

        return redirect()
            ->route('cms.financeiro.professores.competencias.show', [$professor->id, $competenciaValor])
            ->with('success', 'Informações financeiras atualizadas com sucesso.');
    }

    private function assertProfessor(User $professor): void
    {
        if (!$professor->relationLoaded('userType')) {
            $professor->load('userType');
        }

        if (!$professor->userType || $professor->userType->name !== 'professor') {
            abort(404);
        }
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

    private function montarCompetenciasDoAno(Collection $registrosAno, int $anoAtual): Collection
    {
        return collect(array_merge(range(1, 12), [self::DECIMO_TERCEIRO_MES]))->map(function (int $mes) use ($registrosAno, $anoAtual) {
            $competencia = $this->formatCompetenciaValue($anoAtual, $mes);
            $registro = $registrosAno->firstWhere('competencia', $competencia);
            $status = $registro?->status ?? 'sem_registro';

            return [
                'competencia' => $competencia,
                'mes' => $mes,
                'label' => $this->formatCompetenciaLabel($anoAtual, $mes, false),
                'periodo_label' => $this->formatCompetenciaLabel($anoAtual, $mes),
                'status' => $status,
                'status_label' => $status === 'sem_registro'
                    ? 'Sem lançamento'
                    : (self::STATUS_LABELS[$status] ?? ucfirst($status)),
                'valor_previsto' => $registro?->valor_previsto,
                'valor_pago' => $registro?->valor_pago,
                'data_prevista' => optional($registro?->data_prevista)->format('Y-m-d'),
                'data_pagamento' => optional($registro?->data_pagamento)->format('Y-m-d'),
                'is_decimo_terceiro' => $mes === self::DECIMO_TERCEIRO_MES,
            ];
        })->values();
    }

    private function formatCompetenciaValue(int $ano, int $mes): string
    {
        return sprintf('%04d-%02d', $ano, $mes);
    }

    private function formatCompetenciaLabel(int $ano, int $mes, bool $incluirAno = true): string
    {
        if ($mes === self::DECIMO_TERCEIRO_MES) {
            return $incluirAno ? "13º salário de {$ano}" : '13º salário';
        }

        $carbon = Carbon::createFromDate($ano, $mes, 1)->locale('pt_BR');

        return $incluirAno
            ? ucfirst($carbon->translatedFormat('F \d\e Y'))
            : ucfirst($carbon->translatedFormat('F'));
    }

    private function parseCompetencia(string $competencia): array
    {
        if (!preg_match('/^(\\d{4})-(0[1-9]|1[0-3])$/', $competencia, $matches)) {
            abort(404);
        }

        $ano = (int) $matches[1];
        $mes = (int) $matches[2];

        return [
            'ano' => $ano,
            'mes' => $mes,
            'is_decimo_terceiro' => $mes === self::DECIMO_TERCEIRO_MES,
        ];
    }
}
