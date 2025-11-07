/** @jsxImportSource react */
import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CMSLayout from '@/Layouts/CMSLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const FINANCEIRO_STATUS_VARIANTS = {
    em_dia: 'success',
    atrasado: 'destructive',
    sem_registros: 'secondary',
};

function FinanceiroBadge({ status, label }) {
    const variant = FINANCEIRO_STATUS_VARIANTS[status] || 'outline';
    const classes = {
        success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
        destructive: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
        secondary: 'bg-muted text-muted-foreground',
        outline: 'bg-secondary text-secondary-foreground',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${classes[variant] || classes.outline}`}>
            {label}
        </span>
    );
}

export default function Index({ alunos = [] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAlunos = useMemo(() => {
        if (!searchTerm.trim()) {
            return alunos;
        }

        return alunos.filter((aluno) => {
            const termo = searchTerm.toLowerCase();
            return (
                aluno.name?.toLowerCase().includes(termo) ||
                aluno.email?.toLowerCase().includes(termo) ||
                aluno.turma?.nome?.toLowerCase().includes(termo)
            );
        });
    }, [alunos, searchTerm]);

    return (
        <CMSLayout>
            <Head title="Financeiro - Alunos" />

            <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Financeiro</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gerencie as mensalidades dos alunos e acompanhe pendências financeiras
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button type="button" variant="default">
                            🎓 Alunos
                        </Button>
                        <Button type="button" variant="outline" disabled>
                            🧑‍💼 Funcionários (em breve)
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Alunos matriculados</CardTitle>
                        <CardDescription>
                            Visualize rapidamente a situação financeira de cada estudante e acesse detalhes mensais
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <Input
                                type="text"
                                placeholder="Buscar por nome, email ou turma..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className="md:max-w-sm"
                            />
                            <div className="text-sm text-muted-foreground">
                                {filteredAlunos.length} de {alunos.length} alunos exibidos
                            </div>
                        </div>

                        <div className="rounded-lg border border-border dark:border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Aluno</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Turma</TableHead>
                                        <TableHead>Situação Financeira</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAlunos.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                                                Nenhum aluno encontrado com os filtros selecionados.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredAlunos.map((aluno) => (
                                            <TableRow key={aluno.id}>
                                                <TableCell className="space-y-1">
                                                    <div className="font-semibold text-foreground dark:text-foreground">
                                                        {aluno.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{aluno.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={aluno.status === 'ativo' ? 'default' : 'secondary'}>
                                                        {aluno.status_label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {aluno.turma ? (
                                                        <div className="space-y-1">
                                                            <div className="font-medium">{aluno.turma.nome}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {aluno.turma.status === 'em andamento'
                                                                    ? 'Turma ativa'
                                                                    : aluno.turma.status}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">Sem turma vinculada</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <FinanceiroBadge
                                                        status={aluno.financeiro_status}
                                                        label={aluno.financeiro_status_label}
                                                    />
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {aluno.resumo.atrasados > 0
                                                            ? `${aluno.resumo.atrasados} mês(es) em atraso`
                                                            : `${aluno.resumo.pagos} mês(es) pagos`}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/cms/financeiro/alunos/${aluno.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            Visualizar
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CMSLayout>
    );
}
