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
        Schema::table('turmas_criadas', function (Blueprint $table) {
            $table->json('dias_semana')->nullable()->after('alunos');
            $table->time('inicio')->nullable()->after('dias_semana');
            $table->time('fim')->nullable()->after('inicio');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('turmas_criadas', function (Blueprint $table) {
            $table->dropColumn(['dias_semana', 'inicio', 'fim']);
        });
    }
};
