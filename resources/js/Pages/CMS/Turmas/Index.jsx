/** @jsxImportSource react */
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CMSLayout from '@/Layouts/CMSLayout';

export default function Index({ turmasCriadas }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir esta turma?')) {
            destroy(`/cms/turmas/${id}`);
        }
    };

    const getStatusBadge = (status) => {
        const variants = {
            'em andamento': 'success',
            'bloqueada': 'warning',
            'encerrada': 'destructive',
        };
        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    return (
        <CMSLayout>
            <Head title="Turmas - CMS" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Turmas</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Gerencie as turmas criadas, professores e alunos
                        </p>
                    </div>
                    <Link href="/cms/turmas/create">
                        <Button size="lg">
                            <span className="mr-2">➕</span>
                            Nova Turma
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
                            <span className="text-2xl">📚</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{turmasCriadas.length}</div>
                            <p className="text-xs text-muted-foreground">turmas cadastradas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                            <span className="text-2xl">✅</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {turmasCriadas.filter(t => t.status === 'em andamento').length}
                            </div>
                            <p className="text-xs text-muted-foreground">turmas ativas</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                            <span className="text-2xl">👥</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {turmasCriadas.reduce((sum, t) => sum + t.total_alunos, 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">alunos matriculados</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Turmas</CardTitle>
                        <CardDescription>
                            Visualize e gerencie todas as turmas criadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Turma</TableHead>
                                    <TableHead>Professor</TableHead>
                                    <TableHead className="text-center">Alunos</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Criada em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {turmasCriadas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <span className="text-4xl">📭</span>
                                                <p className="text-muted-foreground">Nenhuma turma criada ainda.</p>
                                                <Link href="/cms/turmas/create">
                                                    <Button variant="outline" size="sm" className="mt-2">
                                                        Criar primeira turma
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    turmasCriadas.map((turma) => (
                                        <TableRow key={turma.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">🎓</span>
                                                    <span>{turma.turma_nome}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                                        {turma.professor_nome.charAt(0)}
                                                    </div>
                                                    <span>{turma.professor_nome}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">{turma.total_alunos}</Badge>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(turma.status)}</TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {turma.created_at}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Link href={`/cms/turmas/${turma.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        ✏️ Editar
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(turma.id)}
                                                >
                                                    🗑️ Excluir
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </CMSLayout>
    );
}
