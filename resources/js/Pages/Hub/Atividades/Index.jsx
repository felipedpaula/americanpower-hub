/** @jsxImportSource react */
import { Head, Link, usePage } from '@inertiajs/react';
import HubLayout from '@/Layouts/HubLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AtividadesIndex({ atividades = [] }) {
    const { props } = usePage();
    const userType = props.user?.type || props.auth?.user?.user_type?.name;
    const canCreate = ['professor', 'admin', 'root'].includes(userType);

    return (
        <HubLayout>
            <Head title="Atividades" />

            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Atividades</h1>
                        <p className="text-muted-foreground">
                            Visualize e gerencie as atividades das suas turmas
                        </p>
                    </div>

                    {canCreate && (
                        <Link href="/hub/atividades/create">
                            <Button>
                                Criar atividade
                            </Button>
                        </Link>
                    )}
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de atividades</CardTitle>
                        <CardDescription>
                            {atividades.length > 0
                                ? 'Atividades disponíveis no momento'
                                : 'Nenhuma atividade encontrada para o seu usuário'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {atividades.length === 0 ? (
                            <div className="py-12 text-center text-muted-foreground">
                                <p className="text-lg font-medium">Nada por aqui ainda.</p>
                                <p className="text-sm">
                                    Assim que novas atividades forem criadas, elas aparecerão nesta lista.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {atividades.map((atividade) => (
                                    <Link
                                        key={atividade.id}
                                        href={`/hub/atividades/${atividade.id}`}
                                        className="block rounded-lg border border-border p-4 transition-smooth hover:bg-muted/60"
                                    >
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h2 className="text-lg font-semibold text-foreground">
                                                        {atividade.titulo}
                                                    </h2>
                                                    {atividade.tipo && (
                                                        <Badge variant="secondary">
                                                            {atividade.tipo.nome}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {atividade.turma?.turma?.nome ?? 'Turma não informada'}
                                                </p>
                                                {atividade.descricao && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {atividade.descricao}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground md:items-end">
                                                <Badge variant={
                                                    atividade.status === 'ativa' ? 'default' :
                                                    atividade.status === 'encerrada' ? 'outline' :
                                                    'secondary'
                                                }>
                                                    {atividade.status ?? 'sem status'}
                                                </Badge>
                                                <span>Data de entrega: {atividade.data_entrega ? new Date(atividade.data_entrega).toLocaleDateString() : '—'}</span>
                                                <span>Nota máxima: {atividade.nota_max ?? '—'}</span>
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

