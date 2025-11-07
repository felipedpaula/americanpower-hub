<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinanceiroColaborador extends Model
{
    use HasFactory;

    protected $table = 'financeiro_colaboradores';

    protected $fillable = [
        'colaborador_id',
        'competencia',
        'valor_previsto',
        'data_prevista',
        'valor_pago',
        'data_pagamento',
        'metodo',
        'status',
        'observacao',
    ];

    protected $casts = [
        'data_prevista' => 'date',
        'data_pagamento' => 'date',
        'valor_previsto' => 'decimal:2',
        'valor_pago' => 'decimal:2',
    ];

    public function colaborador()
    {
        return $this->belongsTo(User::class, 'colaborador_id');
    }
}
