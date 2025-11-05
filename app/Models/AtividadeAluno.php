<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtividadeAluno extends Model
{
    use HasFactory;

    protected $table = 'atividade_aluno';

    protected $fillable = [
        'atividade_id',
        'aluno_id',
        'status',
        'data_submissao',
        'data_correcao',
        'nota_total',
        'comentario_professor',
    ];

    protected $casts = [
        'data_submissao' => 'datetime',
        'data_correcao' => 'datetime',
        'nota_total' => 'decimal:2',
    ];

    public function atividade()
    {
        return $this->belongsTo(Atividade::class, 'atividade_id');
    }

    public function aluno()
    {
        return $this->belongsTo(User::class, 'aluno_id');
    }
}
