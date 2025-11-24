<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\FinanceiroAluno;
use App\Models\FinanceiroProfessor;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class RelatorioController extends Controller
{
    private const DECIMO_TERCEIRO_MES = 13;

    public function index(Request $request): Response
    {
        $anoAtual = (int) $request->query('ano', now()->year);
        $mesFiltro = $request->query('mes');
        $tipoFiltro = $request->query('tipo', 'todos');

        $anosDisponiveis = $this->buscarAnosDisponiveis();
        if ($anosDisponiveis->isNotEmpty() && !$anosDisponiveis->contains($anoAtual)) {
            $anoAtual = $anosDisponiveis->max();
        }

        $mesSelecionado = $mesFiltro ? (int) $mesFiltro : null;

        $entradas = $this->buscarRegistros(FinanceiroAluno::query(), $anoAtual, $mesSelecionado);
        $saidas = $this->buscarRegistros(FinanceiroProfessor::query(), $anoAtual, $mesSelecionado);

        $relatorios = [
            'entradas' => $this->montarResumo($entradas, $anoAtual, $mesSelecionado),
            'saidas' => $this->montarResumo($saidas, $anoAtual, $mesSelecionado),
        ];

        if ($tipoFiltro === 'entradas') {
            $relatorios['saidas']['oculto'] = true;
        } elseif ($tipoFiltro === 'saidas') {
            $relatorios['entradas']['oculto'] = true;
        }

        return Inertia::render('CMS/Relatorios/Index', [
            'relatorios' => $relatorios,
            'filtros' => [
                'ano' => $anoAtual,
                'mes' => $mesSelecionado,
                'tipo' => $tipoFiltro,
            ],
            'anosDisponiveis' => $anosDisponiveis,
            'mesesDisponiveis' => $this->listarMeses($anoAtual, $mesSelecionado),
        ]);
    }

    private function buscarAnosDisponiveis(): Collection
    {
        $anosAlunos = FinanceiroAluno::selectRaw('DISTINCT SUBSTRING(competencia, 1, 4) as ano')->pluck('ano');
        $anosProfessores = FinanceiroProfessor::selectRaw('DISTINCT SUBSTRING(competencia, 1, 4) as ano')->pluck('ano');

        $anos = $anosAlunos
            ->merge($anosProfessores)
            ->filter()
            ->map(fn ($ano) => (int) $ano)
            ->unique()
            ->sort()
            ->values();

        if ($anos->isEmpty()) {
            $anos->push(now()->year);
        }

        return $anos;
    }

    private function buscarRegistros(Builder $query, int $ano, ?int $mes): Collection
    {
        $competenciaBase = sprintf('%04d-', $ano);

        $query->where('competencia', 'like', $competenciaBase . '%');

        if ($mes) {
            $query->where('competencia', sprintf('%04d-%02d', $ano, $mes));
        }

        return $query->get();
    }

    private function montarResumo(Collection $registros, int $ano, ?int $mes): array
    {
        $previsto = $registros->sum(fn ($registro) => (float) ($registro->valor_previsto ?? 0));
        $realizado = $registros->sum(fn ($registro) => (float) ($registro->valor_pago ?? 0));
        $pendente = $registros
            ->filter(fn ($registro) => in_array($registro->status, ['aberto', 'atrasado']))
            ->sum(function ($registro) {
                $previsto = (float) ($registro->valor_previsto ?? 0);
                $pago = (float) ($registro->valor_pago ?? 0);

                return max(0, $previsto - $pago);
            });

        $quantidades = $registros->groupBy('status')->map->count();

        $temDecimoTerceiro = $registros->contains(function ($registro) {
            return substr((string) $registro->competencia, 5, 2) === '13';
        }) || $mes === self::DECIMO_TERCEIRO_MES;

        $mesesParaListar = $temDecimoTerceiro
            ? array_merge(range(1, 12), [self::DECIMO_TERCEIRO_MES])
            : range(1, 12);

        $mensal = collect($mesesParaListar)
            ->map(function (int $mesAtual) use ($registros, $ano) {
                $competencia = sprintf('%04d-%02d', $ano, $mesAtual);
                $registrosMes = $registros->filter(fn ($registro) => $registro->competencia === $competencia);

                $previstoMes = $registrosMes->sum(fn ($registro) => (float) ($registro->valor_previsto ?? 0));
                $pagoMes = $registrosMes->sum(fn ($registro) => (float) ($registro->valor_pago ?? 0));
                $label = $mesAtual === self::DECIMO_TERCEIRO_MES
                    ? '13º salário'
                    : ucfirst(Carbon::createFromDate($ano, $mesAtual, 1)->locale('pt_BR')->translatedFormat('F'));

                return [
                    'mes' => $mesAtual,
                    'label' => $label,
                    'previsto' => $previstoMes,
                    'realizado' => $pagoMes,
                    'pendente' => max(0, $previstoMes - $pagoMes),
                ];
            })
            ->filter(fn ($linha) => $mes ? $linha['mes'] === $mes : true)
            ->values();

        return [
            'totais' => [
                'previsto' => round($previsto, 2),
                'realizado' => round($realizado, 2),
                'pendente' => round($pendente, 2),
            ],
            'quantidades' => [
                'total' => $registros->count(),
                'por_status' => [
                    'aberto' => $quantidades->get('aberto', 0),
                    'atrasado' => $quantidades->get('atrasado', 0),
                    'pago' => $quantidades->get('pago', 0),
                    'isento' => $quantidades->get('isento', 0),
                ],
            ],
            'mensal' => $mensal,
        ];
    }

    private function listarMeses(int $ano, ?int $mesSelecionado): Collection
    {
        return collect(array_merge(range(1, 12), [self::DECIMO_TERCEIRO_MES]))->map(function (int $mes) use ($ano, $mesSelecionado) {
            $label = $mes === self::DECIMO_TERCEIRO_MES
                ? '13º salário'
                : ucfirst(Carbon::createFromDate($ano, $mes, 1)->locale('pt_BR')->translatedFormat('F'));

            return [
                'valor' => $mes,
                'label' => $label,
                'ativo' => !$mesSelecionado || $mesSelecionado === $mes,
            ];
        });
    }
}
