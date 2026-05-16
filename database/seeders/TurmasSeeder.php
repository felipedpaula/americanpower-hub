<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TurmasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('turmas')->insert([
            ['nome' => '1a', 'ordem' => 1],
            ['nome' => '1b', 'ordem' => 2],
            ['nome' => '2a', 'ordem' => 3],
            ['nome' => '2b', 'ordem' => 4],
            ['nome' => '3a', 'ordem' => 5],
            ['nome' => '3b', 'ordem' => 6],
            ['nome' => 'advanced', 'ordem' => 7],
        ]);

        $joao  = DB::table('users')->where('email', 'joao@americanpower.com')->value('id');
        $maria = DB::table('users')->where('email', 'maria@americanpower.com')->value('id');

        $turmas = DB::table('turmas')->orderBy('ordem')->pluck('id', 'nome');

        // Distribuição: João → 1a, 2a, 3a, advanced | Maria → 1b, 2b, 3b
        $associacoes = [
            ['turma_id' => $turmas['1a'],       'professor_id' => $joao],
            ['turma_id' => $turmas['1b'],       'professor_id' => $maria],
            ['turma_id' => $turmas['2a'],       'professor_id' => $joao],
            ['turma_id' => $turmas['2b'],       'professor_id' => $maria],
            ['turma_id' => $turmas['3a'],       'professor_id' => $joao],
            ['turma_id' => $turmas['3b'],       'professor_id' => $maria],
            ['turma_id' => $turmas['advanced'], 'professor_id' => $joao],
        ];

        $now = now();
        $rows = array_map(fn($a) => array_merge($a, [
            'status'     => 'em andamento',
            'created_at' => $now,
            'updated_at' => $now,
        ]), $associacoes);

        DB::table('turmas_criadas')->insert($rows);
    }
}
