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
    }
}
