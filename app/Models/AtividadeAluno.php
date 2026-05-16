<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtividadeAluno extends Model
{
    use HasFactory;

    public const STATUS_PENDENTE = 'pendente';
    public const STATUS_ENTREGUE = 'entregue';
    public const STATUS = [
        self::STATUS_PENDENTE,
        self::STATUS_ENTREGUE,
    ];

    protected $table = 'atividade_aluno';

    protected $fillable = [
        'atividade_id',
        'aluno_id',
        'status',
        'data_submissao',
        'nota_total',
    ];

    protected $casts = [
        'data_submissao' => 'datetime',
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

    public function respostas()
    {
        return $this->hasMany(AtividadeResposta::class, 'atividade_aluno_id');
    }
}
