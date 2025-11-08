/** @jsxImportSource react */
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CMSLayout from '@/Layouts/CMSLayout';

export default function Index({ eventosEscola = [], eventosExternos = [] }) {
    const { props } = usePage();
    const flash = props.flash || {};

    return (
        <CMSLayout>
            <Head title="Eventos - CMS" />

            <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Eventos</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Gerencie os eventos internos da escola e os eventos externos em um só lugar
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Link href="/cms/eventos/escola/create">
                            <Button className="w-full sm:w-auto">
                                <span className="mr-2">🏫</span>
                                Novo Evento da Escola
                            </Button>
                        </Link>
                        <Link href="/cms/eventos/externos/create">
                            <Button variant="outline" className="w-full sm:w-auto">
                                <span className="mr-2">🌎</span>
                                Novo Evento Externo
                            </Button>
                        </Link>
                    </div>
                </div>

                {flash.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700 shadow-sm">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Eventos da Escola</CardTitle>
                            <CardDescription>
                                Acompanhe os eventos internos organizados pelas turmas e equipe pedagógica
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {eventosEscola.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                                    Nenhum evento da escola cadastrado até o momento.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {eventosEscola.map((evento) => (
                                        <div
                                            key={`escola-${evento.id}`}
                                            className="rounded-lg border border-border bg-card/40 p-4 shadow-sm transition-smooth"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
                                                        {evento.titulo}
                                                    </h3>
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        {evento.data_hora}
                                                    </p>
                                                    {evento.descricao && (
                                                        <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                                                    )}
                                                </div>

                                                {evento.turma && (
                                                    <div className="rounded-md bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                                                        <p className="font-medium text-foreground dark:text-foreground">
                                                            Turma: {evento.turma.nome || 'Não informada'}
                                                        </p>
                                                        {evento.turma.professor && (
                                                            <p>Professor responsável: {evento.turma.professor}</p>
                                                        )}
                                                    </div>
                                                )}

                                                {evento.conteudo && (
                                                    <div className="rounded-md bg-background px-3 py-2 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                                                        {evento.conteudo}
                                                    </div>
                                                )}

                                                {evento.created_at && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Criado em {evento.created_at}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Eventos Externos</CardTitle>
                            <CardDescription>
                                Divulgue oportunidades, parcerias e eventos externos relevantes para a comunidade
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {eventosExternos.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                                    Nenhum evento externo cadastrado até o momento.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {eventosExternos.map((evento) => (
                                        <div
                                            key={`externo-${evento.id}`}
                                            className="rounded-lg border border-border bg-card/40 p-4 shadow-sm transition-smooth"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="text-lg font-semibold text-foreground dark:text-foreground">
                                                        {evento.titulo}
                                                    </h3>
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        {evento.data_hora}
                                                    </p>
                                                    {evento.descricao && (
                                                        <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                                                    )}
                                                </div>

                                                <div className="rounded-md bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
                                                    <p className="font-medium text-foreground dark:text-foreground">
                                                        Responsável: {evento.responsavel}
                                                    </p>
                                                    {evento.img_destaque && (
                                                        <p className="mt-1 text-xs">
                                                            Imagem de destaque: <span className="break-all">{evento.img_destaque}</span>
                                                        </p>
                                                    )}
                                                </div>

                                                {evento.conteudo && (
                                                    <div className="rounded-md bg-background px-3 py-2 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                                                        {evento.conteudo}
                                                    </div>
                                                )}

                                                {evento.created_at && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Criado em {evento.created_at}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </CMSLayout>
    );
}
