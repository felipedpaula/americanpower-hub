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
        Schema::create('eventos_externos', function (Blueprint $table) {
            $table->id();
            $table->dateTime('data_hora');
            $table->string('titulo');
            $table->text('descricao')->nullable();
            $table->longText('conteudo')->nullable();
            $table->string('responsavel');
            $table->string('img_destaque')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eventos_externos');
    }
};
