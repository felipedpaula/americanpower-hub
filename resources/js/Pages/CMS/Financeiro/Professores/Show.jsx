/** @jsxImportSource react */
import { useMemo } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import CMSLayout from '@/Layouts/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import FinanceiroTabs from '../components/Tabs';

const STATUS_COLORS = {
    aberto: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200',
    pago: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200',
    atrasado: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200',
    isento: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200',
    sem_registro: 'bg-muted text-muted-foreground',
};

const SITUACAO_CONFIG = {
    em_dia: {
        icon: '✅',
        title: 'Tudo em dia',
        description: 'Nenhum lançamento em atraso registrado.',
        classes: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200',
    },
    atrasado: {
        icon: '⚠️',
        title: 'Pendências detectadas',
        description: 'Existem lançamentos atrasados ou pendentes de pagamento.',
        classes: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-200',
    },
};

export default function Show({ professor, resumo, anoAtual, anosDisponiveis = [], meses = [], statusOptions = [], tabs = [] }) {
    const { props } = usePage();

    const statusMap = useMemo(() => {
        const map = {};
        statusOptions.forEach((option) => {
            map[option.value] = option.label;
        });
        map.sem_registro = 'Sem lançamento';
        return map;
    }, [statusOptions]);

    const situacao = SITUACAO_CONFIG[resumo?.situacao || 'em_dia'];

    const handleChangeAno = (value) => {
        router.get(`/cms/financeiro/professores/${professor.id}`, { ano: value }, { preserveState: true, preserveScroll: true });
    };

    return (
        <CMSLayout>
            <Head title={`Financeiro - ${professor?.name}`} />

            <div className="space-y-6 animate-fadeIn">
                <FinanceiroTabs tabs={tabs} className="justify-start md:justify-end" />
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link href="/cms/financeiro/professores" className="text-sm text-muted-foreground hover:text-foreground">
                            ← Voltar para listagem de professores
                        </Link>
                        <h1 className="mt-2 text-3xl font-bold text-foreground dark:text-foreground">{professor?.name}</h1>
                        <p className="mt-1 text-sm text-muted-foreground">{professor?.email}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <Badge variant={professor?.status === 'ativo' ? 'default' : 'secondary'}>{professor?.status_label}</Badge>
                    </div>
                </div>

                {props.flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {props.flash.success}
                    </div>
                )}

                <Card className={situacao?.classes}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <span className="text-xl">{situacao?.icon}</span>
                                {situacao?.title}
                            </CardTitle>
                            <CardDescription className="text-sm opacity-80">
                                {resumo?.mensagem || situacao?.description}
                            </CardDescription>
                        </div>
                        <div className="rounded-md bg-white/70 px-3 py-1 text-sm font-medium text-foreground dark:bg-background/40">
                            Ano {anoAtual}
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-4">
                        <div>
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">Total previsto</span>
                            <p className="text-xl font-semibold text-foreground">
                                R$ {Number(resumo?.totais?.previsto || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">Total pago</span>
                            <p className="text-xl font-semibold text-foreground">
                                R$ {Number(resumo?.totais?.pago || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">Lançamentos atrasados</span>
                            <p className="text-xl font-semibold text-foreground">{resumo?.contagem?.atrasados || 0}</p>
                        </div>
                        <div>
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">Lançamentos pagos</span>
                            <p className="text-xl font-semibold text-foreground">{resumo?.contagem?.pagos || 0}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <CardTitle>Pagamentos por competência</CardTitle>
                            <CardDescription>
                                Acompanhe o status de cada mês do ano selecionado. Clique para visualizar ou editar os detalhes.
                            </CardDescription>
                        </div>
                        <div className="w-full md:w-56">
                            <Select value={String(anoAtual)} onValueChange={handleChangeAno}>
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
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {meses.map((mes) => (
                                <Card key={mes.competencia} className="border border-border bg-card hover:border-primary transition-colors">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <div>
                                            <CardTitle className="text-base font-semibold capitalize">{mes.label}</CardTitle>
                                            <CardDescription>{mes.competencia}</CardDescription>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                STATUS_COLORS[mes.status] || STATUS_COLORS.sem_registro
                                            }`}
                                        >
                                            {statusMap[mes.status] || mes.status}
                                        </span>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Valor previsto</span>
                                            <span className="font-medium">
                                                {mes.valor_previsto
                                                    ? `R$ ${Number(mes.valor_previsto).toLocaleString('pt-BR', {
                                                          minimumFractionDigits: 2,
                                                      })}`
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Valor pago</span>
                                            <span className="font-medium">
                                                {mes.valor_pago
                                                    ? `R$ ${Number(mes.valor_pago).toLocaleString('pt-BR', {
                                                          minimumFractionDigits: 2,
                                                      })}`
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Previsão</span>
                                            <span className="font-medium">
                                                {mes.data_prevista
                                                    ? new Date(mes.data_prevista).toLocaleDateString('pt-BR')
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Pagamento</span>
                                            <span className="font-medium">
                                                {mes.data_pagamento
                                                    ? new Date(mes.data_pagamento).toLocaleDateString('pt-BR')
                                                    : '—'}
                                            </span>
                                        </div>
                                        <div className="pt-3">
                                            <Link href={`/cms/financeiro/professores/${professor.id}/competencias/${mes.competencia}`}>
                                                <Button variant="outline" className="w-full" size="sm">
                                                    Visualizar mês
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </CMSLayout>
    );
}
