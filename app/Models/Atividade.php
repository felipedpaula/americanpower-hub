<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atividade extends Model
{
    use HasFactory;

    protected $table = 'atividade';

    protected $fillable = [
        'turma_criada_id',
        'professor_id',
        'titulo',
        'descricao',
        'instrucoes',
        'nota_max',
        'data_entrega',
    ];

    protected $casts = [
        'data_entrega' => 'datetime',
        'nota_max' => 'decimal:2',
    ];

    public function turmaCriada()
    {
        return $this->belongsTo(TurmaCriada::class, 'turma_criada_id');
    }

    /**
     * Alias mantido para telas existentes que exibem a turma da atividade.
     */
    public function turma()
    {
        return $this->belongsTo(TurmaCriada::class, 'turma_criada_id');
    }

    public function professor()
    {
        return $this->belongsTo(User::class, 'professor_id');
    }

    public function blocos()
    {
        return $this->hasMany(AtividadeBloco::class, 'atividade_id')->orderBy('ordem');
    }

    public function atividadeAlunos()
    {
        return $this->hasMany(AtividadeAluno::class, 'atividade_id');
    }

    /**
     * Verifica se um usuário pode acessar esta atividade
     */
    public function canAccess(User $user): bool
    {
        $userType = $user->userType->name;

        if (in_array($userType, ['root', 'admin'])) {
            return true;
        }

        if ($userType === 'professor') {
            return $this->canManage($user);
        }

        if ($userType === 'aluno') {
            return $this->atividadeAlunos()
                ->where('aluno_id', $user->id)
                ->exists();
        }

        return false;
    }

    public function canManage(User $user): bool
    {
        $userType = $user->userType->name;

        if (in_array($userType, ['root', 'admin'])) {
            return true;
        }

        if ($userType === 'professor') {
            return $this->professor_id === $user->id
                || $this->turmaCriada?->professor_id === $user->id;
        }

        return false;
    }

    /**
     * Verifica se um usuário pode editar esta atividade
     */
    public function canEdit(User $user): bool
    {
        if (!$this->turmaCriada || $this->turmaCriada->status !== 'em andamento') {
            return false;
        }

        return $this->canManage($user);
    }

    public function hasEntregas(): bool
    {
        return $this->atividadeAlunos()
            ->where('status', AtividadeAluno::STATUS_ENTREGUE)
            ->exists();
    }
}
