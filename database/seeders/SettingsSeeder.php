<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('settings')->insert([
            'nome_escola' => 'American Power',
            'nome_diretora' => 'Valéria',
            'cnpj' => '',
            'site' => 'https://americanpower.com.br',
            'endereco' => 'R. José de Arimatéia e Silva, 432 - CENTRO, Inhumas - GO, 75400-000',
            'cidade' => 'Inhumas',
            'estado' => 'Goiás',
            'telefone' => '(62) 35142067',
            'whatsapp' => '(62) 984061568',
            'email' => 'am.power@hotmail.com',
            'instagram' => '@americanpowerinhumas',
            'facebook' => 'americanpowerinhumas',
            'modelo_calendario' => 'Semestral',
            'ano_letivo_atual' => '2025',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
