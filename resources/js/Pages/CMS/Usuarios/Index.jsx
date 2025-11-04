/** @jsxImportSource react */
import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import CMSLayout from '@/Layouts/CMSLayout';

export default function Index({ usuarios, stats }) {
    const { delete: destroy } = useForm();
    const [activeTab, setActiveTab] = useState('alunos');

    const categories = [
        {
            key: 'alunos',
            label: 'Alunos',
            icon: '🎓',
            description: 'Estudantes matriculados na escola',
            count: stats.alunos || 0,
        },
        {
            key: 'professores',
            label: 'Professores',
            icon: '👩‍🏫',
            description: 'Equipe pedagógica responsável pelas turmas',
            count: stats.professores || 0,
        },
        {
            key: 'colaboradores',
            label: 'Colaboradores',
            icon: '🧑‍💼',
            description: 'Profissionais de apoio e administração',
            count: stats.colaboradores || 0,
        },
    ];

    const activeCategory = categories.find((category) => category.key === activeTab) || categories[0];
    const activeUsers = usuarios?.[activeCategory.key] || [];

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            destroy(`/cms/usuarios/${id}`);
        }
    };

    return (
        <CMSLayout>
            <Head title="Usuários - CMS" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Usuários</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Gerencie alunos, professores e colaboradores da escola
                        </p>
                    </div>
                    <Link href="/cms/usuarios/create">
                        <Button size="lg">
                            <span className="mr-2">➕</span>
                            Novo Usuário
                        </Button>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                            <span className="text-2xl">👥</span>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total || 0}</div>
                            <p className="text-xs text-muted-foreground">usuários cadastrados</p>
                        </CardContent>
                    </Card>

                    {categories.map((category) => (
                        <Card key={category.key}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{category.label}</CardTitle>
                                <span className="text-2xl">{category.icon}</span>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{category.count}</div>
                                <p className="text-xs text-muted-foreground">{category.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Tabs */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <CardTitle>Gerenciamento de Usuários</CardTitle>
                                <CardDescription>
                                    Visualize e gerencie os usuários de acordo com a categoria
                                </CardDescription>
                            </div>
                            <div className="flex items-center space-x-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category.key}
                                        type="button"
                                        variant={activeCategory.key === category.key ? 'default' : 'outline'}
                                        onClick={() => setActiveTab(category.key)}
                                    >
                                        <span className="mr-2">{category.icon}</span>
                                        {category.label}
                                        <Badge variant="secondary" className="ml-2">
                                            {category.count}
                                        </Badge>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Criado em</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {activeUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex flex-col items-center space-y-2">
                                                <span className="text-4xl">📭</span>
                                                <p className="text-muted-foreground">
                                                    Nenhum usuário cadastrado nesta categoria ainda.
                                                </p>
                                                <Link href="/cms/usuarios/create">
                                                    <Button variant="outline" size="sm">
                                                        Cadastrar usuário
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    activeUsers.map((usuario) => (
                                        <TableRow key={usuario.id}>
                                            <TableCell className="font-medium">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                                                        {usuario.initials}
                                                    </div>
                                                    <span>{usuario.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{usuario.email}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{usuario.tipo}</Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {usuario.created_at || '—'}
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Link href={`/cms/usuarios/${usuario.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        ✏️ Editar
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(usuario.id)}
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
