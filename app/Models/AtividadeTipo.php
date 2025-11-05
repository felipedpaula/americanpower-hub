<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtividadeTipo extends Model
{
    use HasFactory;

    protected $table = 'atividade_tipos';

    protected $fillable = ['titulo'];

    public function atividades()
    {
        return $this->hasMany(Atividade::class, 'tipo_id');
    }
}
