<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventoExterno extends Model
{
    use HasFactory;

    protected $table = 'eventos_externos';

    protected $fillable = [
        'data_hora',
        'titulo',
        'descricao',
        'conteudo',
        'responsavel',
        'img_destaque',
    ];

    protected $casts = [
        'data_hora' => 'datetime',
    ];
}
