<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\Atividade;
use App\Models\TurmaCriada;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TurmaController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $userType = $user->userType->name;

        $query = TurmaCriada::with(['turma', 'professor']);

        if ($userType === 'professor') {
            $query->where('professor_id', $user->id);
        } elseif ($userType === 'aluno') {
            $query->where(function ($q) use ($user) {
                $q->whereJsonContains('alunos', (string) $user->id)
                    ->orWhereJsonContains('alunos', $user->id);
            });
        }

        $turmas = $query->orderBy('status')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($turma) use ($user, $userType) {
                $totalAlunos = count($turma->alunos ?? []);

                return [
                    'id' => $turma->id,
                    'status' => $turma->status,
                    'dias_semana' => $turma->dias_semana ?? [],
                    'inicio' => $turma->inicio,
                    'fim' => $turma->fim,
                    'total_alunos' => $totalAlunos,
                    'turma' => [
                        'nome' => $turma->turma->nome ?? "Turma #{$turma->id}",
                    ],
                    'professor' => [
                        'id' => $turma->professor?->id,
                        'name' => $turma->professor->name ?? null,
                    ],
                    'podeGerenciar' => in_array($userType, ['root', 'admin']) || ($userType === 'professor' && $turma->professor_id === $user->id),
                ];
            });

        return Inertia::render('Hub/Turmas/Index', [
            'turmas' => $turmas,
            'userType' => $userType,
        ]);
    }

    public function show($id)
    {
        $user = auth()->user();
        $userType = $user->userType->name;

        $turma = TurmaCriada::with(['turma', 'professor'])->findOrFail($id);

        if (!$turma->canAccess($user)) {
            abort(403, 'Você não tem acesso a esta turma.');
        }

        $alunoIds = $turma->alunos ?? [];
        $alunos = [];

        if (!empty($alunoIds)) {
            $alunos = User::whereIn('id', $alunoIds)
                ->orderBy('name')
                ->get(['id', 'name', 'email'])
                ->map(function ($aluno) {
                    return [
                        'id' => $aluno->id,
                        'name' => $aluno->name,
                        'email' => $aluno->email,
                    ];
                });
        }

        $atividades = Atividade::with('tipo')
            ->where('turma_id', $turma->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($atividade) {
                return [
                    'id' => $atividade->id,
                    'titulo' => $atividade->titulo,
                    'status' => $atividade->status ?? 'sem status',
                    'nota_max' => $atividade->nota_max,
                    'data_entrega' => optional($atividade->data_entrega)->format('Y-m-d'),
                    'tipo' => [
                        'nome' => $atividade->tipo->nome ?? $atividade->tipo->titulo ?? 'Não definido',
                    ],
                ];
            });

        return Inertia::render('Hub/Turmas/Show', [
            'turma' => [
                'id' => $turma->id,
                'status' => $turma->status,
                'dias_semana' => $turma->dias_semana ?? [],
                'inicio' => $turma->inicio,
                'fim' => $turma->fim,
                'total_alunos' => count($alunoIds),
                'turma' => [
                    'nome' => $turma->turma->nome ?? "Turma #{$turma->id}",
                ],
                'professor' => [
                    'id' => $turma->professor?->id,
                    'name' => $turma->professor->name ?? null,
                    'email' => $turma->professor->email ?? null,
                ],
                'podeGerenciar' => in_array($userType, ['root', 'admin']) || ($userType === 'professor' && $turma->professor_id === $user->id),
            ],
            'alunos' => $alunos,
            'atividades' => $atividades,
            'userType' => $userType,
        ]);
    }
}
