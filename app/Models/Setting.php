<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome_escola',
        'nome_diretora',
        'cnpj',
        'site',
        'endereco',
        'cidade',
        'estado',
        'telefone',
        'whatsapp',
        'email',
        'instagram',
        'facebook',
        'modelo_calendario',
        'ano_letivo_atual',
    ];
}
