<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Turma;
use App\Models\TurmaCriada;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TurmaController extends Controller
{
    public function index()
    {
        $turmasCriadas = TurmaCriada::with(['turma', 'professor'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($turmaCriada) {
                return [
                    'id' => $turmaCriada->id,
                    'turma_nome' => $turmaCriada->turma->nome,
                    'professor_nome' => $turmaCriada->professor->name,
                    'total_alunos' => count($turmaCriada->alunos ?? []),
                    'status' => $turmaCriada->status,
                    'created_at' => $turmaCriada->created_at->format('d/m/Y'),
                ];
            });

        // Calcular estatísticas
        $stats = [
            'total' => $turmasCriadas->count(),
            'em_andamento' => $turmasCriadas->filter(function ($t) { return $t['status'] === 'em andamento'; })->count(),
            'bloqueada' => $turmasCriadas->filter(function ($t) { return $t['status'] === 'bloqueada'; })->count(),
            'encerrada' => $turmasCriadas->filter(function ($t) { return $t['status'] === 'encerrada'; })->count(),
            'total_alunos' => $turmasCriadas->sum(function ($t) { return $t['total_alunos']; }),
        ];

        return Inertia::render('CMS/Turmas/Index', [
            'turmasCriadas' => $turmasCriadas,
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        $turmas = Turma::orderBy('ordem')->get();
        $professores = User::whereHas('userType', function ($query) {
            $query->where('name', 'professor');
        })->get(['id', 'name']);
        
        $alunos = User::whereHas('userType', function ($query) {
            $query->where('name', 'aluno');
        })->get(['id', 'name']);

        // Obter IDs de alunos já alocados em outras turmas
        $alunosAlocados = TurmaCriada::whereNotNull('alunos')
            ->pluck('alunos')
            ->flatten()
            ->unique()
            ->toArray();

        // Filtrar alunos disponíveis
        $alunosDisponiveis = $alunos->filter(function ($aluno) use ($alunosAlocados) {
            return !in_array($aluno->id, $alunosAlocados);
        })->values();

        return Inertia::render('CMS/Turmas/Create', [
            'turmas' => $turmas,
            'professores' => $professores,
            'alunos' => $alunosDisponiveis,
            'totalAlunosAlocados' => count($alunosAlocados),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'turma_id' => 'required|exists:turmas,id',
            'professor_id' => 'required|exists:users,id',
            'alunos' => 'nullable|array',
            'alunos.*' => 'exists:users,id',
            'status' => 'required|in:em andamento,bloqueada,encerrada',
        ]);

        // Validar se algum aluno já está alocado em outra turma
        if (!empty($validated['alunos'])) {
            $alunosEmOutrasTurmas = TurmaCriada::whereNotNull('alunos')
                ->get()
                ->filter(function ($turma) use ($validated) {
                    $alunosDaTurma = $turma->alunos ?? [];
                    return count(array_intersect($validated['alunos'], $alunosDaTurma)) > 0;
                });

            if ($alunosEmOutrasTurmas->count() > 0) {
                return back()->withErrors([
                    'alunos' => 'Alguns alunos já estão alocados em outras turmas.'
                ])->withInput();
            }
        }

        TurmaCriada::create($validated);

        return redirect()->route('cms.turmas.index')
            ->with('success', 'Turma criada com sucesso!');
    }

    public function edit($id)
    {
        $turmaCriada = TurmaCriada::with(['turma', 'professor'])->findOrFail($id);
        
        $turmas = Turma::orderBy('ordem')->get();
        $professores = User::whereHas('userType', function ($query) {
            $query->where('name', 'professor');
        })->get(['id', 'name']);
        
        $alunos = User::whereHas('userType', function ($query) {
            $query->where('name', 'aluno');
        })->get(['id', 'name']);

        // Obter IDs de alunos já alocados em outras turmas (excluindo esta turma)
        $alunosAlocados = TurmaCriada::where('id', '!=', $id)
            ->whereNotNull('alunos')
            ->pluck('alunos')
            ->flatten()
            ->unique()
            ->toArray();

        // Filtrar alunos disponíveis (não incluindo os já alocados em outras turmas)
        $alunosDisponiveis = $alunos->filter(function ($aluno) use ($alunosAlocados) {
            return !in_array($aluno->id, $alunosAlocados);
        })->values();

        return Inertia::render('CMS/Turmas/Edit', [
            'turmaCriada' => [
                'id' => $turmaCriada->id,
                'turma_id' => $turmaCriada->turma_id,
                'professor_id' => $turmaCriada->professor_id,
                'alunos' => $turmaCriada->alunos ?? [],
                'status' => $turmaCriada->status,
            ],
            'turmas' => $turmas,
            'professores' => $professores,
            'alunos' => $alunosDisponiveis,
            'totalAlunosAlocados' => count($alunosAlocados),
        ]);
    }

    public function update(Request $request, $id)
    {
        $turmaCriada = TurmaCriada::findOrFail($id);

        $validated = $request->validate([
            'turma_id' => 'required|exists:turmas,id',
            'professor_id' => 'required|exists:users,id',
            'alunos' => 'nullable|array',
            'alunos.*' => 'exists:users,id',
            'status' => 'required|in:em andamento,bloqueada,encerrada',
        ]);

        // Validar se algum aluno já está alocado em outra turma (excluindo esta)
        if (!empty($validated['alunos'])) {
            $alunosEmOutrasTurmas = TurmaCriada::where('id', '!=', $id)
                ->whereNotNull('alunos')
                ->get()
                ->filter(function ($turma) use ($validated) {
                    $alunosDaTurma = $turma->alunos ?? [];
                    return count(array_intersect($validated['alunos'], $alunosDaTurma)) > 0;
                });

            if ($alunosEmOutrasTurmas->count() > 0) {
                return back()->withErrors([
                    'alunos' => 'Alguns alunos já estão alocados em outras turmas.'
                ])->withInput();
            }
        }

        $turmaCriada->update($validated);

        return redirect()->route('cms.turmas.index')
            ->with('success', 'Turma atualizada com sucesso!');
    }

    public function destroy($id)
    {
        $turmaCriada = TurmaCriada::findOrFail($id);
        $turmaCriada->delete();

        return redirect()->route('cms.turmas.index')
            ->with('success', 'Turma excluída com sucesso!');
    }
}
