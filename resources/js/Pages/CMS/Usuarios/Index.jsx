/** @jsxImportSource react */
import { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import CMSLayout from '@/Layouts/CMSLayout';

export default function Index({ usuarios, stats }) {
    const { delete: destroy } = useForm();
    const [activeTab, setActiveTab] = useState('alunos');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        {
            key: 'root',
            label: 'Root',
            icon: '👑',
            description: 'Administradores principais do sistema',
            count: stats.root || 0,
        },
        {
            key: 'admins',
            label: 'Administradores',
            icon: '🛡️',
            description: 'Equipe administrativa da escola',
            count: stats.admins || 0,
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
        {
            key: 'alunos',
            label: 'Alunos',
            icon: '🎓',
            description: 'Estudantes matriculados na escola',
            count: stats.alunos || 0,
        },
    ];

    const activeCategory = categories.find((category) => category.key === activeTab) || categories[0];
    const activeUsers = usuarios?.[activeCategory.key] || [];

    // Filtrar usuários baseado no termo de busca
    const filteredUsers = useMemo(() => {
        if (!searchTerm.trim()) return activeUsers;

        return activeUsers.filter((usuario) =>
            usuario.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [activeUsers, searchTerm]);

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            destroy(`/cms/usuarios/${id}`);
        }
    };

    return (
        <CMSLayout>
            <Head title="Usuários - CMS" />

            <div className="space-y-6 animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Usuários</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gerencie todos os usuários do sistema: administradores, professores, colaboradores e alunos
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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
                                    Visualize e gerencie todos os usuários do sistema por categoria
                                </CardDescription>
                            </div>
                        </div>

                        {/* Filtros responsivos */}
                        <div className="flex flex-col gap-4 mt-4">
                            {/* Buttons de categoria - responsivos */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => (
                                    <Button
                                        key={category.key}
                                        type="button"
                                        variant={activeCategory.key === category.key ? 'default' : 'outline'}
                                        onClick={() => setActiveTab(category.key)}
                                        className="text-xs sm:text-sm"
                                    >
                                        <span className="mr-1 sm:mr-2">{category.icon}</span>
                                        <span className="hidden sm:inline">{category.label}</span>
                                        <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                                        <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs">
                                            {category.count}
                                        </Badge>
                                    </Button>
                                ))}
                            </div>

                            {/* Campo de busca */}
                            <Input
                                type="text"
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full"
                            />

                            {/* Contador */}
                            <div className="text-sm text-muted-foreground">
                                {filteredUsers.length} de {activeUsers.length} usuários
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
                                {filteredUsers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8">
                                            <div className="flex flex-col items-center space-y-2">
                                                <span className="text-4xl">📭</span>
                                                <p className="text-muted-foreground">
                                                    {searchTerm.trim()
                                                        ? 'Nenhum usuário encontrado com os critérios de busca.'
                                                        : 'Nenhum usuário cadastrado nesta categoria ainda.'
                                                    }
                                                </p>
                                                {!searchTerm.trim() && (
                                                    <Link href="/cms/usuarios/create">
                                                        <Button variant="outline" size="sm">
                                                            Cadastrar usuário
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredUsers.map((usuario) => (
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
