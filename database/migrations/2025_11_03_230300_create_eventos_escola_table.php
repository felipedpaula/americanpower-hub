<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('eventos_escola', function (Blueprint $table) {
            $table->id();
            $table->foreignId('id_turma')->constrained('turmas_criadas')->cascadeOnDelete();
            $table->dateTime('data_hora');
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->longText('conteudo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos_escola');
    }
};
