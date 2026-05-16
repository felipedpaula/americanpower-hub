/** @jsxImportSource react */
import { Head, Link, usePage } from '@inertiajs/react';
import HubLayout from '@/Layouts/HubLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const formatDateTime = (value) => {
    if (!value) return 'Sem prazo';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Sem prazo';

    return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
};

const statusVariant = (status) => {
    if (status === 'entregue') return 'default';
    if (status === 'pendente') return 'secondary';
    return 'outline';
};

export default function AtividadesIndex({ atividades = [] }) {
    const { props } = usePage();
    const userType = props.user?.type || props.auth?.user?.user_type?.name;
    const canCreate = ['professor', 'admin', 'root'].includes(userType);
    const isAluno = userType === 'aluno';

    return (
        <HubLayout>
            <Head title="Atividades" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Atividades</h1>
                        <p className="text-sm text-muted-foreground">
                            {isAluno
                                ? 'Acompanhe suas atividades, entregas e notas.'
                                : 'Crie atividades por turma e acompanhe as entregas dos alunos.'}
                        </p>
                    </div>

                    {canCreate && (
                        <Link href="/hub/atividades/create">
                            <Button>Criar atividade</Button>
                        </Link>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de atividades</CardTitle>
                        <CardDescription>
                            {atividades.length > 0
                                ? `${atividades.length} atividade(s) encontrada(s)`
                                : 'Nenhuma atividade encontrada para o seu usuário'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {atividades.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                <p className="text-lg font-medium">Nada por aqui ainda.</p>
                                <p className="text-sm">
                                    Quando uma atividade for criada para sua turma, ela aparecerá nesta lista.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {atividades.map((atividade) => {
                                    const entrega = atividade.minha_entrega;

                                    return (
                                        <Link
                                            key={atividade.id}
                                            href={`/hub/atividades/${atividade.id}`}
                                            className="block rounded-lg border border-border p-4 transition hover:bg-muted/60"
                                        >
                                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h2 className="text-lg font-semibold text-foreground">
                                                            {atividade.titulo}
                                                        </h2>
                                                        {entrega && (
                                                            <Badge variant={statusVariant(entrega.status)}>
                                                                {entrega.status}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">
                                                        {atividade.turma_criada?.turma?.nome ?? 'Turma não informada'}
                                                    </p>
                                                    {atividade.descricao && (
                                                        <p className="line-clamp-2 text-sm text-muted-foreground">
                                                            {atividade.descricao}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground md:items-end">
                                                    <span>Prazo: {formatDateTime(atividade.data_entrega)}</span>
                                                    <span>Nota máxima: {atividade.nota_max ?? '—'}</span>
                                                    {isAluno ? (
                                                        <span>
                                                            Nota final: {entrega?.nota_total ?? '—'}
                                                        </span>
                                                    ) : (
                                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                                            <Badge variant="outline">
                                                                {atividade.entregues_count ?? 0} entregue(s)
                                                            </Badge>
                                                            <Badge variant="secondary">
                                                                {atividade.pendentes_count ?? 0} pendente(s)
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </HubLayout>
    );
}
