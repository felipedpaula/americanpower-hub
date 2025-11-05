<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HubController extends Controller
{
    /**
     * Exibe o dashboard do Hub baseado no tipo de usuário
     */
    public function dashboard(Request $request)
    {
        $user = auth()->user();
        $userType = $user->userType->name;

        // Dados básicos que todos os usuários verão
        $data = [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'type' => $userType,
            ],
        ];

        // Adiciona informações específicas por tipo de usuário
        switch ($userType) {
            case 'root':
            case 'admin':
                // Administradores veem estatísticas gerais
                $data['stats'] = [
                    'total_usuarios' => \App\Models\User::count(),
                    'total_professores' => \App\Models\User::whereHas('userType', function($q) {
                        $q->where('name', 'professor');
                    })->count(),
                    'total_alunos' => \App\Models\User::whereHas('userType', function($q) {
                        $q->where('name', 'aluno');
                    })->count(),
                ];
                break;

            case 'professor':
                // Professores veem suas turmas e atividades
                $data['turmas'] = \App\Models\TurmaCriada::where('professor_id', $user->id)
                    ->with('turma')
                    ->get();
                break;

            case 'aluno':
                // Alunos veem suas turmas e atividades pendentes
                $turmasCriadas = \App\Models\TurmaCriada::whereJsonContains('alunos', (string)$user->id)
                    ->with('turma', 'professor')
                    ->get();
                
                $data['turmas'] = $turmasCriadas;
                break;
        }

        return Inertia::render('Hub/Dashboard', $data);
    }

    /**
     * Retorna os recursos disponíveis para o tipo de usuário
     */
    public function getAvailableResources()
    {
        $userType = auth()->user()->userType->name;

        $resources = [
            'root' => [
                'dashboard' => true,
                'atividades' => true,
                'criar_atividade' => true,
                'gerenciar_usuarios' => true,
                'relatorios' => true,
                'configuracoes' => true,
            ],
            'admin' => [
                'dashboard' => true,
                'atividades' => true,
                'criar_atividade' => true,
                'gerenciar_usuarios' => true,
                'relatorios' => true,
                'configuracoes' => false,
            ],
            'professor' => [
                'dashboard' => true,
                'atividades' => true,
                'criar_atividade' => true,
                'minhas_turmas' => true,
                'corrigir_atividades' => true,
                'relatorios' => true,
            ],
            'aluno' => [
                'dashboard' => true,
                'atividades' => true,
                'entregar_atividade' => true,
                'minhas_notas' => true,
                'minhas_turmas' => true,
            ],
        ];

        return response()->json([
            'resources' => $resources[$userType] ?? [],
        ]);
    }
}
