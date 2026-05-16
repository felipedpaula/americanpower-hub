<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type_id',
        'cpf',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function userType()
    {
        return $this->belongsTo(UserType::class);
    }

    public function atividadesAluno()
    {
        return $this->hasMany(AtividadeAluno::class, 'aluno_id');
    }

    public function atividadesProfessor()
    {
        return $this->hasMany(Atividade::class, 'professor_id');
    }

    public function respostasAtividades()
    {
        return $this->hasManyThrough(
            AtividadeResposta::class,
            AtividadeAluno::class,
            'aluno_id',
            'atividade_aluno_id',
            'id',
            'id'
        );
    }

    public function financeiroAlunos()
    {
        return $this->hasMany(FinanceiroAluno::class, 'aluno_id');
    }

    public function financeiroProfessores()
    {
        return $this->hasMany(FinanceiroProfessor::class, 'professor_id');
    }

    public function financeiroColaboradores()
    {
        return $this->hasMany(FinanceiroColaborador::class, 'colaborador_id');
    }
}
