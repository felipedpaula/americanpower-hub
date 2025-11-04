<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TurmaCriada extends Model
{
    use HasFactory;

    protected $table = 'turmas_criadas';

    protected $fillable = ['turma_id', 'alunos', 'professor_id', 'status'];

    protected $casts = [
        'alunos' => 'array',
    ];

    public function turma()
    {
        return $this->belongsTo(Turma::class);
    }

    public function professor()
    {
        return $this->belongsTo(User::class, 'professor_id');
    }

    public function alunos()
    {
        return User::whereIn('id', $this->alunos ?? [])->get();
    }
}
