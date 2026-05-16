<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtividadeResposta extends Model
{
    use HasFactory;

    protected $table = 'atividade_respostas';

    protected $fillable = [
        'atividade_aluno_id',
        'atividade_bloco_id',
        'resposta',
    ];

    protected $casts = [
        'resposta' => 'array',
    ];

    public function atividadeAluno()
    {
        return $this->belongsTo(AtividadeAluno::class, 'atividade_aluno_id');
    }

    public function atividadeBloco()
    {
        return $this->belongsTo(AtividadeBloco::class, 'atividade_bloco_id');
    }
}
