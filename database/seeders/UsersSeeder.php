<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Usuário Root
        DB::table('users')->insert([
            'name' => 'Felipe',
            'email' => 'felipeppdev@gmail.com',
            'password' => Hash::make('12345678'),
            'user_type_id' => 1, // root
        ]);

        // Admin
        DB::table('users')->insert([
            'name' => 'Admin User',
            'email' => 'admin@americanpower.com',
            'password' => Hash::make('12345678'),
            'user_type_id' => 2, // admin
        ]);

        // Professores
        DB::table('users')->insert([
            [
                'name' => 'Prof. João Silva',
                'email' => 'joao@americanpower.com',
                'password' => Hash::make('12345678'),
                'user_type_id' => 3, // professor
            ],
            [
                'name' => 'Prof. Maria Santos',
                'email' => 'maria@americanpower.com',
                'password' => Hash::make('12345678'),
                'user_type_id' => 3, // professor
            ],
        ]);

        // Alunos
        DB::table('users')->insert([
            [
                'name' => 'Pedro Oliveira',
                'email' => 'pedro@aluno.com',
                'password' => Hash::make('12345678'),
                'user_type_id' => 5, // aluno
            ],
            [
                'name' => 'Ana Costa',
                'email' => 'ana@aluno.com',
                'password' => Hash::make('12345678'),
                'user_type_id' => 5, // aluno
            ],
            [
                'name' => 'Lucas Ferreira',
                'email' => 'lucas@aluno.com',
                'password' => Hash::make('12345678'),
                'user_type_id' => 5, // aluno
            ],
            [
                'name' => 'Julia Almeida',
                'email' => 'julia@aluno.com',
                'password' => Hash::make('12345678'),
                'user_type_id' => 5, // aluno
            ],
        ]);
    }
}