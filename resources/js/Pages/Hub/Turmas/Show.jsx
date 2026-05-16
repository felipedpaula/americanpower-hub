/** @jsxImportSource react */
import { Head, Link } from '@inertiajs/react';
import HubLayout from '@/Layouts/HubLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const weekdayLabels = {
    domingo: 'Domingo',
    segunda: 'Segunda',
    terca: 'Terça',
    quarta: 'Quarta',
    quinta: 'Quinta',
    sexta: 'Sexta',
    sabado: 'Sábado',
};

const formatDias = (dias = []) => {
    if (!Array.isArray(dias) || dias.length === 0) {
        return 'Dias não definidos';
    }

    const ordered = Object.keys(weekdayLabels).filter((dia) => dias.includes(dia));
    return ordered.length > 0
        ? ordered.map((dia) => weekdayLabels[dia]).join(', ')
        : 'Dias não definidos';
};

const formatHorario = (inicio, fim) => {
    if (!inicio && !fim) return 'Horário não definido';
    if (inicio && fim) return `${inicio} às ${fim}`;
    return inicio ? `Início às ${inicio}` : `Até ${fim}`;
};

const formatDataEntrega = (value) => {
    if (!value) return 'Sem data';
    try {
        const date = new Date(value);
        return Number.isNaN(date.getTime())
            ? 'Sem data'
            : date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return 'Sem data';
    }
};

export default function ShowTurma({ turma, alunos = [], atividades = [], userType }) {
    if (!turma) {
        return (
            <HubLayout>
                <Head title="Turma não encontrada" />
                <div className="rounded-lg border border-border bg-card p-6 text-center">
                    <h1 className="text-lg font-semibold text-foreground">Turma não encontrada</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Verifique se você possui acesso a esta turma e tente novamente.
                    </p>
                    <Link href="/hub/turmas" className="mt-4 inline-block">
                        <Button variant="outline">Voltar para turmas</Button>
                    </Link>
                </div>
            </HubLayout>
        );
    }

    const canManage = Boolean(turma.podeGerenciar);

    return (
        <HubLayout>
            <Head title={`Turma: ${turma.turma?.nome ?? turma.id}`} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Turma</p>
                        <h1 className="text-2xl font-bold text-foreground">
                            {turma.turma?.nome ?? `Turma #${turma.id}`}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {turma.total_alunos} aluno(s) | {formatDias(turma.dias_semana)} | {formatHorario(turma.inicio, turma.fim)}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant={
                                turma.status === 'em andamento'
                                    ? 'default'
                                    : turma.status === 'bloqueada'
                                        ? 'destructive'
                                        : 'secondary'
                            }
                        >
                            {turma.status}
                        </Badge>
                        <Link href="/hub/turmas">
                            <Button variant="outline">Voltar</Button>
                        </Link>
                        {canManage && (
                            <Link href="/hub/atividades/create">
                                <Button>Criar atividade</Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações da turma</CardTitle>
                            <CardDescription>Detalhes compartilhados com todos os membros</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">Professor responsável</p>
                                <p className="font-medium text-foreground">
                                    {turma.professor?.name ?? 'Não definido'}
                                </p>
                                {turma.professor?.email && (
                                    <p className="text-muted-foreground">{turma.professor.email}</p>
                                )}
                            </div>
                            <div>
                                <p className="text-muted-foreground">Dias da semana</p>
                                <p className="font-medium text-foreground">{formatDias(turma.dias_semana)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Horário</p>
                                <p className="font-medium text-foreground">{formatHorario(turma.inicio, turma.fim)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Status</p>
                                <p className="font-medium text-foreground capitalize">{turma.status}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Participantes</CardTitle>
                            <CardDescription>Alunos matriculados nesta turma</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {alunos.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhum aluno cadastrado.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {alunos.map((aluno) => (
                                        <li
                                            key={aluno.id}
                                            className="flex items-center justify-between rounded-md border border-border px-3 py-2"
                                        >
                                            <div>
                                                <p className="text-sm font-medium text-foreground">{aluno.name}</p>
                                                <p className="text-xs text-muted-foreground">{aluno.email}</p>
                                            </div>
                                            <Badge variant="outline">Aluno</Badge>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <CardTitle>Atividades da turma</CardTitle>
                            <CardDescription>
                                Acompanhe as atividades publicadas para esta turma
                            </CardDescription>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {atividades.length} atividade(s)
                        </div>
                    </CardHeader>
                    <CardContent>
                        {atividades.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Ainda não existem atividades cadastradas para esta turma.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {atividades.map((atividade) => (
                                    <Link
                                        key={atividade.id}
                                        href={`/hub/atividades/${atividade.id}`}
                                        className="block rounded-lg border border-border p-4 transition hover:bg-muted/60"
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-foreground">
                                                    {atividade.titulo}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {atividade.entregues_count ?? 0} entregue(s) | {atividade.pendentes_count ?? 0} pendente(s)
                                                </p>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                                <span>Entrega: {formatDataEntrega(atividade.data_entrega)}</span>
                                                <span>Nota máx.: {atividade.nota_max ?? '—'}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </HubLayout>
    );
}
