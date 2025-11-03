<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('user_types')->insert([
            ['name' => 'root', 'permission_level' => 5],
            ['name' => 'admin', 'permission_level' => 4],
            ['name' => 'professor', 'permission_level' => 3],
            ['name' => 'colaborador', 'permission_level' => 2],
            ['name' => 'aluno', 'permission_level' => 1],
        ]);
    }
}
