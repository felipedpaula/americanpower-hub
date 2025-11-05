<?php

namespace App\Http\Controllers\CMS;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function edit()
    {
        $setting = Setting::first();

        if (! $setting) {
            $setting = Setting::create([
                'nome_escola' => '',
                'nome_diretora' => '',
                'cnpj' => null,
                'site' => null,
                'endereco' => '',
                'cidade' => '',
                'estado' => '',
                'telefone' => null,
                'whatsapp' => null,
                'email' => null,
                'instagram' => null,
                'facebook' => null,
                'modelo_calendario' => '',
                'ano_letivo_atual' => '',
            ]);
        }

        return Inertia::render('CMS/Settings/Edit', [
            'setting' => $setting,
            'calendarOptions' => [
                'Bimestral',
                'Trimestral',
                'Semestral',
                'Anual',
            ],
        ]);
    }

    public function update(Request $request)
    {
        $setting = Setting::firstOrFail();

        $data = $request->validate([
            'nome_escola' => ['required', 'string', 'max:255'],
            'nome_diretora' => ['required', 'string', 'max:255'],
            'cnpj' => ['nullable', 'string', 'max:255'],
            'site' => ['nullable', 'url'],
            'endereco' => ['required', 'string', 'max:500'],
            'cidade' => ['required', 'string', 'max:255'],
            'estado' => ['required', 'string', 'max:255'],
            'telefone' => ['nullable', 'string', 'max:255'],
            'whatsapp' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'facebook' => ['nullable', 'string', 'max:255'],
            'modelo_calendario' => ['required', 'string', 'max:255'],
            'ano_letivo_atual' => ['required', 'string', 'max:10'],
        ]);

        $setting->update($data);

        return redirect()
            ->route('cms.settings.edit')
            ->with('success', 'Configurações atualizadas com sucesso!');
    }
}
