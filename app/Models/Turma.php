<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Turma extends Model
{
    use HasFactory;

    protected $fillable = ['nome', 'ordem'];

    public function turmasCriadas()
    {
        return $this->hasMany(TurmaCriada::class);
    }
}
