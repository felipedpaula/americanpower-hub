/** @jsxImportSource react */
import { useMemo, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import CMSLayout from '@/Layouts/CMSLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import FinanceiroTabs from '../components/Tabs';

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

export default function Index({ professores = [], tabs = [] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProfessores = useMemo(() => {
        if (!searchTerm.trim()) {
            return professores;
        }

        const termo = searchTerm.toLowerCase();
        return professores.filter((professor) => {
            return (
                professor.name?.toLowerCase().includes(termo) ||
                professor.email?.toLowerCase().includes(termo)
            );
        });
    }, [professores, searchTerm]);

    return (
        <CMSLayout>
            <Head title="Financeiro - Professores" />

            <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Financeiro</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gerencie os pagamentos de professores, incluindo lançamentos mensais e 13º salário.
                        </p>
                    </div>
                    <FinanceiroTabs tabs={tabs} />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Professores cadastrados</CardTitle>
                        <CardDescription>
                            Visualize rapidamente a situação financeira de cada professor e registre pagamentos mensais e o 13º salário.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <Input
                                type="text"
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className="md:max-w-sm"
                            />
                            <div className="text-sm text-muted-foreground">
                                {filteredProfessores.length} de {professores.length} professores exibidos
                            </div>
                        </div>

                        <div className="rounded-lg border border-border dark:border-border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Professor</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Situação Financeira</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProfessores.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                                                Nenhum professor encontrado com os filtros selecionados.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredProfessores.map((professor) => (
                                            <TableRow key={professor.id}>
                                                <TableCell className="space-y-1">
                                                    <div className="font-semibold text-foreground dark:text-foreground">
                                                        {professor.name}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{professor.email}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={professor.status === 'ativo' ? 'default' : 'secondary'}>
                                                        {professor.status_label}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <FinanceiroBadge
                                                        status={professor.financeiro_status}
                                                        label={professor.financeiro_status_label}
                                                    />
                                                    <div className="mt-1 text-xs text-muted-foreground">
                                                        {professor.resumo.atrasados > 0
                                                            ? `${professor.resumo.atrasados} mês(es) em atraso`
                                                            : `${professor.resumo.pagos} mês(es) pagos`}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link href={`/cms/financeiro/professores/${professor.id}`}>
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
