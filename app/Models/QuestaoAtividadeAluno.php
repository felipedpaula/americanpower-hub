<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestaoAtividadeAluno extends Model
{
    use HasFactory;

    protected $table = 'questoes_atividade_aluno';

    protected $fillable = [
        'questao_id',
        'aluno_id',
        'resposta',
        'status',
        'nota_obtida',
    ];

    protected $casts = [
        'nota_obtida' => 'decimal:2',
    ];

    public function questao()
    {
        return $this->belongsTo(QuestaoAtividade::class, 'questao_id');
    }

    public function aluno()
    {
        return $this->belongsTo(User::class, 'aluno_id');
    }
}
