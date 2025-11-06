<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class TurmaCriada extends Model
{
    use HasFactory;

    protected $table = 'turmas_criadas';

    protected $fillable = ['turma_id', 'alunos', 'professor_id', 'status', 'dias_semana', 'inicio', 'fim'];

    protected $casts = [
        'alunos' => 'array',
        'dias_semana' => 'array',
        'inicio' => 'string',
        'fim' => 'string',
    ];

    public function turma()
    {
        return $this->belongsTo(Turma::class);
    }

    public function professor()
    {
        return $this->belongsTo(User::class, 'professor_id');
    }

    public function alunos()
    {
        return User::whereIn('id', $this->alunos ?? [])->get();
    }

    public function canAccess(User $user): bool
    {
        $userType = $user->userType->name;

        if (in_array($userType, ['root', 'admin'])) {
            return true;
        }

        if ($userType === 'professor') {
            return $this->professor_id === $user->id;
        }

        if ($userType === 'aluno') {
            $alunos = $this->alunos ?? [];
            return in_array($user->id, $alunos) || in_array((string)$user->id, $alunos);
        }

        return false;
    }
}
