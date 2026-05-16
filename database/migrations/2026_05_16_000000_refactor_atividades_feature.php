<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->dropLegacyTriggers();

        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('atividade_respostas');
        Schema::dropIfExists('atividade_blocos');
        Schema::dropIfExists('questoes_atividade_aluno');
        Schema::dropIfExists('questoes_atividade');
        Schema::dropIfExists('atividade_aluno');
        Schema::dropIfExists('atividade');
        Schema::dropIfExists('atividade_tipos');
        Schema::enableForeignKeyConstraints();

        Schema::create('atividade', function (Blueprint $table) {
            $table->id();
            $table->foreignId('turma_criada_id')->constrained('turmas_criadas')->onDelete('cascade');
            $table->foreignId('professor_id')->constrained('users');
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->text('instrucoes')->nullable();
            $table->unsignedDecimal('nota_max', 8, 2);
            $table->dateTime('data_entrega')->nullable();
            $table->timestamps();
        });

        Schema::create('atividade_blocos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atividade_id')->constrained('atividade')->onDelete('cascade');
            $table->enum('tipo', ['traducao', 'complete', 'pergunta_resposta', 'alternativa']);
            $table->unsignedInteger('ordem');
            $table->string('titulo')->nullable();
            $table->json('conteudo');
            $table->timestamps();

            $table->unique(['atividade_id', 'ordem']);
        });

        Schema::create('atividade_aluno', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atividade_id')->constrained('atividade')->onDelete('cascade');
            $table->foreignId('aluno_id')->constrained('users')->onDelete('cascade');
            $table->enum('status', ['pendente', 'entregue'])->default('pendente');
            $table->timestamp('data_submissao')->nullable();
            $table->unsignedDecimal('nota_total', 8, 2)->nullable();
            $table->timestamps();

            $table->unique(['atividade_id', 'aluno_id']);
        });

        Schema::create('atividade_respostas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('atividade_aluno_id')->constrained('atividade_aluno')->onDelete('cascade');
            $table->foreignId('atividade_bloco_id')->constrained('atividade_blocos')->onDelete('cascade');
            $table->json('resposta');
            $table->timestamps();

            $table->unique(['atividade_aluno_id', 'atividade_bloco_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('atividade_respostas');
        Schema::dropIfExists('atividade_blocos');
        Schema::dropIfExists('atividade_aluno');
        Schema::dropIfExists('atividade');
        Schema::enableForeignKeyConstraints();
    }

    private function dropLegacyTriggers(): void
    {
        foreach ([
            'trg_questoes_atividade_before_insert',
            'trg_questoes_atividade_before_update',
            'trg_questoes_atividade_aluno_after_insert',
            'trg_questoes_atividade_aluno_after_update',
            'trg_questoes_atividade_aluno_after_delete',
        ] as $trigger) {
            DB::unprepared("DROP TRIGGER IF EXISTS {$trigger}");
        }
    }
};
