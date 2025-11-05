<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class AtividadeTiposSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $now = Carbon::now();

        DB::table('atividade_tipos')->upsert([
            ['titulo' => 'tarefa', 'created_at' => $now, 'updated_at' => $now],
            ['titulo' => 'trabalho', 'created_at' => $now, 'updated_at' => $now],
            ['titulo' => 'prova', 'created_at' => $now, 'updated_at' => $now],
        ], ['titulo']);
    }
}
