/** @jsxImportSource react */
import { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import CMSLayout from '@/Layouts/CMSLayout';

export default function Index({ turmasCriadas, stats }) {
    const { delete: destroy } = useForm();
    const [activeStatus, setActiveStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const statusOptions = [
        { key: 'all', label: 'Todas', icon: '📚', count: stats.total },
        { key: 'em andamento', label: 'Em Andamento', icon: '✅', count: stats.em_andamento },
        { key: 'bloqueada', label: 'Bloqueadas', icon: '🔒', count: stats.bloqueada },
        { key: 'encerrada', label: 'Encerradas', icon: '✓', count: stats.encerrada },
    ];

    const filteredTurmas = useMemo(() => {
        let result = turmasCriadas;

        // Filtrar por status
        if (activeStatus !== 'all') {
            result = result.filter(t => t.status === activeStatus);
        }

        // Filtrar por busca
        if (searchTerm.trim()) {
            result = result.filter((turma) =>
                turma.turma_nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                turma.professor_nome?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return result;
    }, [turmasCriadas, activeStatus, searchTerm]);

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

            <div className="space-y-6 animate-fadeIn">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Turmas</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
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
                                {stats.em_andamento}
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
                                {stats.total_alunos}
                            </div>
                            <p className="text-xs text-muted-foreground">alunos matriculados</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <CardTitle>Gerenciamento de Turmas</CardTitle>
                                <CardDescription>
                                    Visualize e gerencie todas as turmas criadas
                                </CardDescription>
                            </div>
                        </div>

                        {/* Filtros responsivos */}
                        <div className="flex flex-col gap-4 mt-4">
                            {/* Buttons de status - responsivos */}
                            <div className="flex flex-wrap gap-2">
                                {statusOptions.map((status) => (
                                    <Button
                                        key={status.key}
                                        type="button"
                                        variant={activeStatus === status.key ? 'default' : 'outline'}
                                        onClick={() => setActiveStatus(status.key)}
                                        className="text-xs sm:text-sm"
                                    >
                                        <span className="mr-1 sm:mr-2">{status.icon}</span>
                                        <span className="hidden sm:inline">{status.label}</span>
                                        <span className="sm:hidden">{status.label.split(' ')[0]}</span>
                                        <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                                            {status.count}
                                        </Badge>
                                    </Button>
                                ))}
                            </div>

                            {/* Campo de busca */}
                            <Input
                                type="text"
                                placeholder="Buscar por nome da turma ou professor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />

                            {/* Contador */}
                            <div className="text-sm text-muted-foreground">
                                {filteredTurmas.length} de {turmasCriadas.length} turmas
                            </div>
                        </div>
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
                                {filteredTurmas.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <span className="text-4xl">📭</span>
                                                <p className="text-muted-foreground">
                                                    {searchTerm.trim()
                                                        ? 'Nenhuma turma encontrada com os critérios de busca.'
                                                        : 'Nenhuma turma criada ainda.'
                                                    }
                                                </p>
                                                {!searchTerm.trim() && (
                                                    <Link href="/cms/turmas/create">
                                                        <Button variant="outline" size="sm" className="mt-2">
                                                            Criar primeira turma
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredTurmas.map((turma) => (
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
