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
        Schema::create('turmas_criadas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('turma_id');
            $table->json('alunos')->nullable();
            $table->unsignedBigInteger('professor_id');
            $table->enum('status', ['em andamento', 'bloqueada', 'encerrada'])->default('em andamento');
            $table->timestamps();

            $table->foreign('turma_id')->references('id')->on('turmas')->onDelete('cascade');
            $table->foreign('professor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('turmas_criadas');
    }
};
