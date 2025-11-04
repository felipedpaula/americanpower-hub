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

        return Inertia::render('CMS/Turmas/Index', [
            'turmasCriadas' => $turmasCriadas,
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

        return Inertia::render('CMS/Turmas/Create', [
            'turmas' => $turmas,
            'professores' => $professores,
            'alunos' => $alunos,
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
            'alunos' => $alunos,
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
