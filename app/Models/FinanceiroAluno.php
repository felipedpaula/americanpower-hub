<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinanceiroAluno extends Model
{
    use HasFactory;

    protected $table = 'financeiro_alunos';

    protected $fillable = [
        'aluno_id',
        'competencia',
        'valor_previsto',
        'data_vencimento',
        'valor_pago',
        'data_pagamento',
        'metodo',
        'status',
        'observacao',
    ];

    protected $casts = [
        'data_vencimento' => 'date',
        'data_pagamento' => 'date',
        'valor_previsto' => 'decimal:2',
        'valor_pago' => 'decimal:2',
    ];

    public function aluno()
    {
        return $this->belongsTo(User::class, 'aluno_id');
    }
}
