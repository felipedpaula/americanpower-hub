<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventoEscola extends Model
{
    use HasFactory;

    protected $table = 'eventos_escola';

    protected $fillable = [
        'id_turma',
        'data_hora',
        'titulo',
        'descricao',
        'conteudo',
    ];

    protected $casts = [
        'data_hora' => 'datetime',
    ];

    public function turma()
    {
        return $this->belongsTo(TurmaCriada::class, 'id_turma');
    }
}
