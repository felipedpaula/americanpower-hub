<?php

namespace App\Support\Financeiro;

use App\Models\User;

class FinanceiroTabs
{
    public static function build(?User $user, string $activeKey): array
    {
        $userType = $user?->userType?->name;

        $tabs = [
            [
                'key' => 'alunos',
                'label' => '🎓 Alunos',
                'route' => 'cms.financeiro.index',
                'enabled' => in_array($userType, ['root', 'admin'], true),
            ],
            [
                'key' => 'professores',
                'label' => '🧑‍🏫 Professores',
                'route' => 'cms.financeiro.professores.index',
                'enabled' => in_array($userType, ['root', 'admin'], true),
            ],
            [
                'key' => 'colaboradores',
                'label' => '🧑\u200d💼 Colaboradores',
                'route' => 'cms.financeiro.colaboradores.index',
                'enabled' => $userType === 'root',
                'tooltip' => $userType === 'root' ? null : 'Disponível apenas para usuários root',
            ],
        ];

        return array_map(function (array $tab) use ($activeKey) {
            $href = route($tab['route']);

            return [
                'key' => $tab['key'],
                'label' => $tab['label'],
                'href' => $href,
                'active' => $tab['key'] === $activeKey,
                'enabled' => $tab['enabled'],
                'tooltip' => $tab['tooltip'] ?? null,
            ];
        }, $tabs);
    }
}
