<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Atividade extends Model
{
    use HasFactory;

    protected $table = 'atividade';

    protected $fillable = [
        'tipo_id',
        'turma_id',
        'titulo',
        'descricao',
        'nota_max',
        'data_entrega',
    ];

    protected $casts = [
        'data_entrega' => 'date',
        'nota_max' => 'decimal:2',
    ];

    public function tipo()
    {
        return $this->belongsTo(AtividadeTipo::class, 'tipo_id');
    }

    public function turma()
    {
        return $this->belongsTo(TurmaCriada::class, 'turma_id');
    }

    public function questoes()
    {
        return $this->hasMany(QuestaoAtividade::class, 'atividade_id');
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

        // Admin e Root têm acesso total
        if (in_array($userType, ['root', 'admin'])) {
            return true;
        }

        // Professor: verifica se é o professor da turma
        if ($userType === 'professor') {
            return $this->turma->professor_id === $user->id;
        }

        // Aluno: verifica se está matriculado na turma
        if ($userType === 'aluno') {
            $alunos = $this->turma->alunos ?? [];
            return in_array($user->id, $alunos) || in_array((string)$user->id, $alunos);
        }

        return false;
    }

    /**
     * Verifica se um usuário pode editar esta atividade
     */
    public function canEdit(User $user): bool
    {
        $userType = $user->userType->name;

        if (!$this->turma || $this->turma->status !== 'em andamento') {
            return false;
        }

        // Admin e Root podem editar
        if (in_array($userType, ['root', 'admin'])) {
            return true;
        }

        // Professor: apenas se for o professor da turma
        if ($userType === 'professor') {
            return $this->turma->professor_id === $user->id;
        }

        return false;
    }
}
