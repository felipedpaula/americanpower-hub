/** @jsxImportSource react */
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CMSLayout from '@/Layouts/CMSLayout';

export default function CreateEscola({ turmas = [] }) {
    const hasTurmas = turmas.length > 0;
    const { data, setData, post, processing, errors } = useForm({
        id_turma: hasTurmas ? turmas[0].id : '',
        data_hora: '',
        titulo: '',
        descricao: '',
        conteudo: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/cms/eventos/escola');
    };

    return (
        <CMSLayout>
            <Head title="Novo Evento da Escola - CMS" />

            <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between flex-col gap-4 md:flex-row">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Novo Evento da Escola</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Registre um evento interno vinculado a uma turma específica
                        </p>
                    </div>
                    <Link href="/cms/eventos">
                        <Button variant="outline">← Voltar</Button>
                    </Link>
                </div>

                {!hasTurmas && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                        Nenhuma turma criada foi encontrada. Cadastre uma turma antes de registrar um evento da escola.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações principais</CardTitle>
                                <CardDescription>Preencha os detalhes gerais do evento</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="id_turma">
                                            Turma responsável <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="id_turma"
                                            value={data.id_turma}
                                            onChange={(event) => setData('id_turma', event.target.value)}
                                            disabled={!hasTurmas}
                                            className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.id_turma ? 'border-red-500' : ''}`}
                                        >
                                            {!hasTurmas && <option value="">Nenhuma turma disponível</option>}
                                            {turmas.map((turma) => (
                                                <option key={turma.id} value={turma.id}>
                                                    {turma.nome}
                                                    {turma.professor ? ` — ${turma.professor}` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.id_turma && (
                                            <p className="text-sm text-red-600">{errors.id_turma}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="data_hora">
                                            Data e horário <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="data_hora"
                                            type="datetime-local"
                                            value={data.data_hora}
                                            onChange={(event) => setData('data_hora', event.target.value)}
                                            className={errors.data_hora ? 'border-red-500' : ''}
                                        />
                                        {errors.data_hora && (
                                            <p className="text-sm text-red-600">{errors.data_hora}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="titulo">
                                        Título do evento <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="titulo"
                                        value={data.titulo}
                                        onChange={(event) => setData('titulo', event.target.value)}
                                        placeholder="Ex.: Feira Cultural"
                                        className={errors.titulo ? 'border-red-500' : ''}
                                    />
                                    {errors.titulo && (
                                        <p className="text-sm text-red-600">{errors.titulo}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descricao">Descrição resumida</Label>
                                    <textarea
                                        id="descricao"
                                        value={data.descricao}
                                        onChange={(event) => setData('descricao', event.target.value)}
                                        rows={3}
                                        placeholder="Resumo rápido sobre o evento"
                                        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.descricao ? 'border-red-500' : ''}`}
                                    />
                                    {errors.descricao && (
                                        <p className="text-sm text-red-600">{errors.descricao}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="conteudo">Conteúdo completo</Label>
                                    <textarea
                                        id="conteudo"
                                        value={data.conteudo}
                                        onChange={(event) => setData('conteudo', event.target.value)}
                                        rows={6}
                                        placeholder="Detalhe todas as informações relevantes do evento"
                                        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.conteudo ? 'border-red-500' : ''}`}
                                    />
                                    {errors.conteudo && (
                                        <p className="text-sm text-red-600">{errors.conteudo}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Boas práticas</CardTitle>
                                <CardDescription>Dicas rápidas para criação de eventos internos</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <div className="flex items-start space-x-3">
                                    <span>🗓️</span>
                                    <p>Verifique conflitos de agenda com outros eventos da mesma turma.</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <span>🧑‍🏫</span>
                                    <p>Combine os detalhes com o professor responsável antes de publicar.</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <span>📌</span>
                                    <p>Utilize a descrição completa para destacar atividades, materiais e participantes.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="sticky top-[26rem]">
                            <CardHeader>
                                <CardTitle>Salvar evento</CardTitle>
                                <CardDescription>Revise as informações antes de publicar</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button type="submit" className="w-full" disabled={processing || !hasTurmas}>
                                    {processing ? '⏳ Salvando...' : '✅ Criar evento'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </CMSLayout>
    );
}
