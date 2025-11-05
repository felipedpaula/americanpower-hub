/** @jsxImportSource react */
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CMSLayout from '@/Layouts/CMSLayout';

export default function Dashboard() {
    const quickActions = [
        {
            title: 'Turmas',
            description: 'Gerencie turmas, professores e alunos matriculados.',
            icon: '🎓',
            href: '/cms/turmas',
            color: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
            disabled: false,
        },
        {
            title: 'Usuários',
            description: 'Adicione e gerencie usuários do sistema.',
            icon: '👥',
            href: '/cms/usuarios',
            color: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
            disabled: true,
        },
        {
            title: 'Relatórios',
            description: 'Visualize estatísticas e relatórios de desempenho.',
            icon: '📈',
            href: '/cms/relatorios',
            color: 'bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
            disabled: true,
        },
        {
            title: 'Configurações',
            description: 'Configure preferências do sistema e perfil.',
            icon: '⚙️',
            href: '/cms/configuracoes',
            color: 'bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400',
            disabled: true,
        },
    ];

    return (
        <CMSLayout>
            <Head title="Dashboard - CMS" />

            <div className="space-y-6 animate-fadeIn">
                {/* Welcome Section */}
                <Card className="overflow-hidden border-0 shadow-lg">
                    <div className="bg-gradient-to-r bg-primary p-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">
                                    Bem-vindo ao CMS! 👋
                                </h1>
                                <p className="text-blue-50">
                                    Gerencie sua escola de inglês de forma simples e eficiente
                                </p>
                            </div>
                            <div className="hidden md:block text-6xl">
                                🇺🇸
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Turmas Ativas</CardTitle>
                            <span className="text-2xl">📚</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">em andamento</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Alunos</CardTitle>
                            <span className="text-2xl">👨‍🎓</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">alunos cadastrados</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Professores</CardTitle>
                            <span className="text-2xl">👨‍🏫</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">professores ativos</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Matrículas</CardTitle>
                            <span className="text-2xl">📝</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">este mês</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-bold text-foreground dark:text-foreground mb-4">Ações Rápidas</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action) => (
                            <Card
                                key={action.title}
                                className={action.disabled ? 'opacity-60' : 'hover:shadow-lg transition-smooth'}
                            >
                                <CardHeader>
                                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-2xl mb-3`}>
                                        {action.icon}
                                    </div>
                                    <CardTitle className="text-lg">{action.title}</CardTitle>
                                    <CardDescription className="text-sm">
                                        {action.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {action.disabled ? (
                                        <Button variant="outline" className="w-full" disabled>
                                            Em breve
                                        </Button>
                                    ) : (
                                        <Link href={action.href}>
                                            <Button className="w-full">
                                                Acessar →
                                            </Button>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle>Atividades Recentes</CardTitle>
                        <CardDescription>Últimas ações realizadas no sistema</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8 text-muted-foreground">
                            <span className="text-4xl block mb-2">📊</span>
                            <p>Nenhuma atividade recente</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CMSLayout>
    );
}