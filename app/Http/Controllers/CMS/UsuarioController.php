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
            'root' => $this->formatUsersByType($usuarios, 'root'),
            'admins' => $this->formatUsersByType($usuarios, 'admin'),
            'professores' => $this->formatUsersByType($usuarios, 'professor'),
            'colaboradores' => $this->formatUsersByType($usuarios, 'colaborador'),
            'alunos' => $this->formatUsersByType($usuarios, 'aluno'),
        ];

        $stats = [
            'total' => $usuarios->count(),
            'root' => $usuariosFormatados['root']['total'],
            'admins' => $usuariosFormatados['admins']['total'],
            'professores' => $usuariosFormatados['professores']['total'],
            'colaboradores' => $usuariosFormatados['colaboradores']['total'],
            'alunos' => $usuariosFormatados['alunos']['total'],
        ];

        return Inertia::render('CMS/Usuarios/Index', [
            'usuarios' => [
                'root' => $usuariosFormatados['root']['usuarios'],
                'admins' => $usuariosFormatados['admins']['usuarios'],
                'professores' => $usuariosFormatados['professores']['usuarios'],
                'colaboradores' => $usuariosFormatados['colaboradores']['usuarios'],
                'alunos' => $usuariosFormatados['alunos']['usuarios'],
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
        $user = auth()->user();

        // Root (level 5) pode gerenciar todos os tipos
        if ($user->userType->permission_level >= 5) {
            return UserType::orderBy('permission_level', 'desc')->get();
        }

        // Admin (level 4) pode gerenciar todos os tipos exceto root
        if ($user->userType->permission_level >= 4) {
            return UserType::where('name', '!=', 'root')
                ->orderBy('permission_level', 'desc')
                ->get();
        }

        // Outros usuários só podem gerenciar alunos, professores e colaboradores
        return UserType::whereIn('name', ['aluno', 'professor', 'colaborador'])
            ->orderBy('permission_level', 'desc')
            ->get();
    }

    private function getTypeLabel(string $typeName): string
    {
        return match ($typeName) {
            'root' => 'Root',
            'admin' => 'Administrador',
            'professor' => 'Professor',
            'colaborador' => 'Colaborador',
            'aluno' => 'Aluno',
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
        $currentUser = auth()->user();

        // Root pode gerenciar todos
        if ($currentUser->userType->permission_level >= 5) {
            return;
        }

        // Admin pode gerenciar todos exceto root
        if ($currentUser->userType->permission_level >= 4 && $usuario->userType->name !== 'root') {
            return;
        }

        // Outros usuários só podem gerenciar alunos, professores e colaboradores
        $allowedTypeIds = UserType::whereIn('name', ['aluno', 'professor', 'colaborador'])->pluck('id');

        if (!$allowedTypeIds->contains($usuario->user_type_id)) {
            abort(403, 'Você não tem permissão para gerenciar este tipo de usuário.');
        }
    }
}
