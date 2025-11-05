<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuestaoAtividade extends Model
{
    use HasFactory;

    protected $table = 'questoes_atividade';

    protected $fillable = [
        'atividade_id',
        'enunciado',
        'status',
        'valor',
    ];

    protected $casts = [
        'valor' => 'decimal:2',
    ];

    public function atividade()
    {
        return $this->belongsTo(Atividade::class, 'atividade_id');
    }

    public function respostasAlunos()
    {
        return $this->hasMany(QuestaoAtividadeAluno::class, 'questao_id');
    }
}
