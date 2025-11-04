<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserType;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UsuarioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $allowedTypes = $this->getAllowedUserTypes();
        $allowedTypeIds = $allowedTypes->pluck('id');

        $usuarios = User::with('userType')
            ->whereIn('user_type_id', $allowedTypeIds)
            ->orderBy('name')
            ->get();

        $usuariosFormatados = [
            'alunos' => $this->formatUsersByType($usuarios, 'aluno'),
            'professores' => $this->formatUsersByType($usuarios, 'professor'),
            'colaboradores' => $this->formatUsersByType($usuarios, 'colaborador'),
        ];

        $stats = [
            'total' => $usuarios->count(),
            'alunos' => $usuariosFormatados['alunos']['total'],
            'professores' => $usuariosFormatados['professores']['total'],
            'colaboradores' => $usuariosFormatados['colaboradores']['total'],
        ];

        return Inertia::render('CMS/Usuarios/Index', [
            'usuarios' => [
                'alunos' => $usuariosFormatados['alunos']['usuarios'],
                'professores' => $usuariosFormatados['professores']['usuarios'],
                'colaboradores' => $usuariosFormatados['colaboradores']['usuarios'],
            ],
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('CMS/Usuarios/Create', [
            'userTypes' => $this->getAllowedUserTypes()->map(function (UserType $type) {
                return [
                    'id' => $type->id,
                    'name' => $type->name,
                    'label' => $this->getTypeLabel($type->name),
                ];
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $allowedTypeIds = $this->getAllowedUserTypes()->pluck('id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'user_type_id' => ['required', Rule::in($allowedTypeIds)],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        User::create($validated);

        return redirect()
            ->route('cms.usuarios.index')
            ->with('success', 'Usuário criado com sucesso!');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $usuario): Response
    {
        $this->ensureAllowedUser($usuario);

        return Inertia::render('CMS/Usuarios/Edit', [
            'usuario' => [
                'id' => $usuario->id,
                'name' => $usuario->name,
                'email' => $usuario->email,
                'user_type_id' => $usuario->user_type_id,
                'user_type_label' => $this->getTypeLabel($usuario->userType->name),
                'created_at' => optional($usuario->created_at)->format('d/m/Y H:i'),
            ],
            'userTypes' => $this->getAllowedUserTypes()->map(function (UserType $type) {
                return [
                    'id' => $type->id,
                    'name' => $type->name,
                    'label' => $this->getTypeLabel($type->name),
                ];
            }),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $usuario): RedirectResponse
    {
        $this->ensureAllowedUser($usuario);

        $allowedTypeIds = $this->getAllowedUserTypes()->pluck('id');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($usuario->id)],
            'user_type_id' => ['required', Rule::in($allowedTypeIds)],
            'password' => ['nullable', 'string', 'min:6', 'confirmed'],
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $usuario->update($validated);

        return redirect()
            ->route('cms.usuarios.index')
            ->with('success', 'Usuário atualizado com sucesso!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $usuario): RedirectResponse
    {
        $this->ensureAllowedUser($usuario);

        $usuario->delete();

        return redirect()
            ->route('cms.usuarios.index')
            ->with('success', 'Usuário removido com sucesso!');
    }

    private function getAllowedUserTypes()
    {
        return UserType::whereIn('name', ['aluno', 'professor', 'colaborador'])
            ->orderBy('permission_level', 'desc')
            ->get();
    }

    private function getTypeLabel(string $typeName): string
    {
        return match ($typeName) {
            'aluno' => 'Aluno',
            'professor' => 'Professor',
            'colaborador' => 'Colaborador',
            default => ucfirst($typeName),
        };
    }

    private function formatUsersByType($usuarios, string $type)
    {
        $users = $usuarios->filter(function (User $user) use ($type) {
            return $user->userType && $user->userType->name === $type;
        })->values()->map(function (User $user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'initials' => mb_strtoupper(mb_substr($user->name, 0, 1)),
                'tipo' => $this->getTypeLabel($user->userType->name),
                'created_at' => optional($user->created_at)->format('d/m/Y H:i'),
            ];
        });

        return [
            'total' => $users->count(),
            'usuarios' => $users,
        ];
    }

    private function ensureAllowedUser(User $usuario): void
    {
        $allowedTypeIds = $this->getAllowedUserTypes()->pluck('id');

        if (!$allowedTypeIds->contains($usuario->user_type_id)) {
            abort(403, 'Apenas alunos, professores e colaboradores podem ser gerenciados por este módulo.');
        }
    }
}
