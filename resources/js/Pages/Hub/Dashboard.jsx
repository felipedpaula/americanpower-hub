/** @jsxImportSource react */
import { Head } from '@inertiajs/react';
import HubLayout from '@/Layouts/HubLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const getAlunosCount = (alunosField) => {
    if (!alunosField) {
        return 0;
    }

    if (Array.isArray(alunosField)) {
        return alunosField.length;
    }

    if (typeof alunosField === 'string') {
        try {
            const parsed = JSON.parse(alunosField);
            return Array.isArray(parsed) ? parsed.length : 0;
        } catch (error) {
            console.warn('Não foi possível converter alunos para array:', alunosField);
            return 0;
        }
    }

    return 0;
};

export default function Dashboard({ user, stats, turmas }) {
    const renderDashboardByType = () => {
        switch (user.type) {
            case 'root':
            case 'admin':
                return (
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="hover:shadow-lg transition-smooth">
                            <CardHeader>
                                <CardTitle className="text-lg">Total de Usuários</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-primary">
                                    {stats?.total_usuarios || 0}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-smooth">
                            <CardHeader>
                                <CardTitle className="text-lg">Professores</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-blue-600">
                                    {stats?.total_professores || 0}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-smooth">
                            <CardHeader>
                                <CardTitle className="text-lg">Alunos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold text-green-600">
                                    {stats?.total_alunos || 0}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                );

            case 'professor':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Minhas Turmas</CardTitle>
                                <CardDescription>
                                    Turmas que você está lecionando
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {turmas && turmas.length > 0 ? (
                                    <div className="space-y-4">
                                        {turmas.map((turmaCriada) => (
                                            <div
                                                key={turmaCriada.id}
                                                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-foreground">
                                                            {turmaCriada.turma.nome}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {getAlunosCount(turmaCriada.alunos)} alunos
                                                        </p>
                                                    </div>
                                                    <Badge variant={
                                                        turmaCriada.status === 'em andamento' ? 'default' :
                                                        turmaCriada.status === 'bloqueada' ? 'destructive' :
                                                        'secondary'
                                                    }>
                                                        {turmaCriada.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">
                                        Você ainda não está lecionando em nenhuma turma.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="hover:shadow-lg transition-smooth">
                                <CardHeader>
                                    <CardTitle className="text-lg">Atividades Criadas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold text-primary">0</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Em breve você poderá criar atividades
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-smooth">
                                <CardHeader>
                                    <CardTitle className="text-lg">Correções Pendentes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold text-orange-600">0</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Nenhuma atividade para corrigir
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );

            case 'aluno':
                return (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Minhas Turmas</CardTitle>
                                <CardDescription>
                                    Turmas que você está matriculado
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {turmas && turmas.length > 0 ? (
                                    <div className="space-y-4">
                                        {turmas.map((turmaCriada) => (
                                            <div
                                                key={turmaCriada.id}
                                                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-foreground">
                                                            {turmaCriada.turma.nome}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Professor: {turmaCriada.professor.name}
                                                        </p>
                                                    </div>
                                                    <Badge variant={
                                                        turmaCriada.status === 'em andamento' ? 'default' :
                                                        turmaCriada.status === 'bloqueada' ? 'destructive' :
                                                        'secondary'
                                                    }>
                                                        {turmaCriada.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-muted-foreground">
                                        Você ainda não está matriculado em nenhuma turma.
                                    </p>
                                )}
                            </CardContent>
                        </Card>

                        <div className="grid gap-6 md:grid-cols-2">
                            <Card className="hover:shadow-lg transition-smooth">
                                <CardHeader>
                                    <CardTitle className="text-lg">Atividades Pendentes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold text-orange-600">0</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Nenhuma atividade pendente
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-smooth">
                                <CardHeader>
                                    <CardTitle className="text-lg">Média Geral</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-4xl font-bold text-green-600">-</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Sem atividades avaliadas ainda
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                );

            default:
                return (
                    <Card>
                        <CardHeader>
                            <CardTitle>Bem-vindo ao Hub!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Seu perfil ainda não está configurado.
                            </p>
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <HubLayout>
            <Head title="Dashboard - Hub" />

            <div className="animate-fadeIn">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground">
                        Olá, {user.name}!
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Bem-vindo ao seu painel do Hub American Power
                    </p>
                </div>

                {renderDashboardByType()}
            </div>
        </HubLayout>
    );
}
