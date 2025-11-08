/** @jsxImportSource react */
import { Head, router } from '@inertiajs/react';
import CMSLayout from '@/Layouts/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useMemo } from 'react';

const currency = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
});

const STATUS_LABELS = {
    aberto: 'Em aberto',
    atrasado: 'Em atraso',
    pago: 'Pagos',
    isento: 'Isentos',
};

const STATUS_VARIANTS = {
    aberto: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    atrasado: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    pago: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    isento: 'bg-slate-100 text-slate-800 dark:bg-slate-900/40 dark:text-slate-200',
};

const metricStyle = {
    previsto: 'from-blue-500/10 to-blue-500/5 text-blue-700 dark:text-blue-200',
    realizado: 'from-emerald-500/10 to-emerald-500/5 text-emerald-700 dark:text-emerald-200',
    pendente: 'from-amber-500/10 to-amber-500/5 text-amber-700 dark:text-amber-200',
};

function MetricCard({ label, value, variant }) {
    return (
        <div className={`rounded-xl border border-border dark:border-border bg-gradient-to-br ${metricStyle[variant]} p-5 shadow-sm`}> 
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
        </div>
    );
}

function StatusSummary({ total, statuses }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Situação dos lançamentos</CardTitle>
                <CardDescription>
                    Acompanhe a quantidade de registros de acordo com o status financeiro
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Total de registros</span>
                    <span className="text-lg font-semibold text-foreground">{total}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(statuses).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex items-center justify-between rounded-lg border border-border dark:border-border px-3 py-2"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-foreground">{STATUS_LABELS[key]}</span>
                                <span className="text-xs text-muted-foreground">{key}</span>
                            </div>
                            <Badge variant="outline" className={STATUS_VARIANTS[key]}>
                                {value}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function MonthlyBreakdown({ data }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Detalhamento mensal</CardTitle>
                <CardDescription>Resumo do período filtrado com valores previstos, realizados e pendentes</CardDescription>
            </CardHeader>
            <CardContent>
                {data.length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">
                        Nenhum lançamento encontrado para o período selecionado.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-border dark:border-border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mês</TableHead>
                                    <TableHead className="text-right">Previsto</TableHead>
                                    <TableHead className="text-right">Realizado</TableHead>
                                    <TableHead className="text-right">Pendente</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.map((linha) => (
                                    <TableRow key={linha.mes}>
                                        <TableCell className="font-medium">{linha.label}</TableCell>
                                        <TableCell className="text-right">{currency.format(linha.previsto)}</TableCell>
                                        <TableCell className="text-right">{currency.format(linha.realizado)}</TableCell>
                                        <TableCell className="text-right">{currency.format(linha.pendente)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function RelatorioSection({ titulo, descricao, dados }) {
    if (!dados || dados.oculto) {
        return null;
    }

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-2xl font-semibold text-foreground">{titulo}</h2>
                <p className="text-sm text-muted-foreground">{descricao}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <MetricCard label="Previstas" value={currency.format(dados.totais.previsto)} variant="previsto" />
                <MetricCard label="Realizadas" value={currency.format(dados.totais.realizado)} variant="realizado" />
                <MetricCard label="Pendentes" value={currency.format(dados.totais.pendente)} variant="pendente" />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <StatusSummary total={dados.quantidades.total} statuses={dados.quantidades.por_status} />
                <MonthlyBreakdown data={dados.mensal} />
            </div>
        </section>
    );
}

export default function RelatoriosPage({ relatorios, filtros, anosDisponiveis = [], mesesDisponiveis = [] }) {
    const anoAtual = filtros?.ano ?? new Date().getFullYear();
    const mesAtual = filtros?.mes ? String(filtros.mes) : 'todos';
    const tipoAtual = filtros?.tipo ?? 'todos';

    const handleFilterChange = (field, value) => {
        const payload = {
            ...filtros,
            [field]: value === 'todos' ? null : value,
        };

        router.get('/cms/relatorios', payload, {
            preserveState: true,
            replace: true,
            preserveScroll: true,
        });
    };

    const meses = useMemo(
        () => [
            { valor: 'todos', label: 'Todos os meses' },
            ...mesesDisponiveis.map((mes) => ({
                valor: String(mes.valor),
                label: mes.label,
            })),
        ],
        [mesesDisponiveis]
    );

    return (
        <CMSLayout>
            <Head title="Relatórios Financeiros" />

            <div className="space-y-8 animate-fadeIn">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-foreground">Relatórios Financeiros</h1>
                    <p className="text-sm text-muted-foreground">
                        Visualize o desempenho financeiro da escola com base nos lançamentos de alunos e professores.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Filtros</CardTitle>
                        <CardDescription>Ajuste o período e o tipo de relatório para refinar os dados exibidos</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Ano</p>
                                <Select value={String(anoAtual)} onValueChange={(value) => handleFilterChange('ano', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o ano" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {anosDisponiveis.map((ano) => (
                                            <SelectItem key={ano} value={String(ano)}>
                                                {ano}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Mês</p>
                                <Select value={mesAtual} onValueChange={(value) => handleFilterChange('mes', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o mês" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {meses.map((mes) => (
                                            <SelectItem key={mes.valor} value={mes.valor}>
                                                {mes.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                                <Select value={tipoAtual} onValueChange={(value) => handleFilterChange('tipo', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="todos">Entradas e saídas</SelectItem>
                                        <SelectItem value="entradas">Somente entradas</SelectItem>
                                        <SelectItem value="saidas">Somente saídas</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-12">
                    <RelatorioSection
                        titulo="Entradas"
                        descricao="Resumo das mensalidades dos alunos, considerando valores previstos, recebidos e pendências."
                        dados={relatorios?.entradas}
                    />

                    <RelatorioSection
                        titulo="Saídas"
                        descricao="Resumo dos pagamentos aos professores com previsões, valores pagos e pendências."
                        dados={relatorios?.saidas}
                    />
                </div>
            </div>
        </CMSLayout>
    );
}
