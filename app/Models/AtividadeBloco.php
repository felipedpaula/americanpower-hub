<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AtividadeBloco extends Model
{
    use HasFactory;

    public const TIPO_TRADUCAO = 'traducao';
    public const TIPO_COMPLETE = 'complete';
    public const TIPO_PERGUNTA_RESPOSTA = 'pergunta_resposta';
    public const TIPO_ALTERNATIVA = 'alternativa';

    public const TIPOS = [
        self::TIPO_TRADUCAO,
        self::TIPO_COMPLETE,
        self::TIPO_PERGUNTA_RESPOSTA,
        self::TIPO_ALTERNATIVA,
    ];

    protected $table = 'atividade_blocos';

    protected $fillable = [
        'atividade_id',
        'tipo',
        'ordem',
        'titulo',
        'conteudo',
    ];

    protected $casts = [
        'conteudo' => 'array',
        'ordem' => 'integer',
    ];

    public function atividade()
    {
        return $this->belongsTo(Atividade::class, 'atividade_id');
    }

    public function respostas()
    {
        return $this->hasMany(AtividadeResposta::class, 'atividade_bloco_id');
    }
}
