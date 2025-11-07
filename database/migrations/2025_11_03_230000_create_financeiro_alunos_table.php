<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('financeiro_alunos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('aluno_id')->constrained('users')->onDelete('cascade');
            $table->string('competencia', 7);
            $table->decimal('valor_previsto', 10, 2)->nullable();
            $table->date('data_vencimento')->nullable();
            $table->decimal('valor_pago', 10, 2)->nullable();
            $table->date('data_pagamento')->nullable();
            $table->string('metodo')->nullable();
            $table->string('status')->default('aberto');
            $table->text('observacao')->nullable();
            $table->timestamps();

            $table->unique(['aluno_id', 'competencia']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('financeiro_alunos');
    }
};
