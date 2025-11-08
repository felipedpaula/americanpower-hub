/** @jsxImportSource react */
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CMSLayout from '@/Layouts/CMSLayout';

export default function CreateExterno() {
    const { data, setData, post, processing, errors } = useForm({
        data_hora: '',
        titulo: '',
        descricao: '',
        conteudo: '',
        responsavel: '',
        img_destaque: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/cms/eventos/externos');
    };

    return (
        <CMSLayout>
            <Head title="Novo Evento Externo - CMS" />

            <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between flex-col gap-4 md:flex-row">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Novo Evento Externo</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Cadastre oportunidades, parcerias e eventos externos relevantes para a comunidade
                        </p>
                    </div>
                    <Link href="/cms/eventos">
                        <Button variant="outline">← Voltar</Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações do evento</CardTitle>
                                <CardDescription>Informe os detalhes principais da divulgação</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

                                    <div className="space-y-2">
                                        <Label htmlFor="responsavel">
                                            Responsável <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="responsavel"
                                            value={data.responsavel}
                                            onChange={(event) => setData('responsavel', event.target.value)}
                                            placeholder="Nome da instituição ou contato principal"
                                            className={errors.responsavel ? 'border-red-500' : ''}
                                        />
                                        {errors.responsavel && (
                                            <p className="text-sm text-red-600">{errors.responsavel}</p>
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
                                        placeholder="Ex.: Intercâmbio Cultural"
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
                                        placeholder="Informe rapidamente o objetivo do evento"
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
                                        placeholder="Descreva a programação, público-alvo e demais informações importantes"
                                        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.conteudo ? 'border-red-500' : ''}`}
                                    />
                                    {errors.conteudo && (
                                        <p className="text-sm text-red-600">{errors.conteudo}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="img_destaque">Imagem de destaque (URL)</Label>
                                    <Input
                                        id="img_destaque"
                                        value={data.img_destaque}
                                        onChange={(event) => setData('img_destaque', event.target.value)}
                                        placeholder="https://..."
                                        className={errors.img_destaque ? 'border-red-500' : ''}
                                    />
                                    {errors.img_destaque && (
                                        <p className="text-sm text-red-600">{errors.img_destaque}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6 lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Boas práticas</CardTitle>
                                <CardDescription>Orientações para eventos externos</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <div className="flex items-start space-x-3">
                                    <span>🌐</span>
                                    <p>Informe a fonte e o responsável para facilitar contatos posteriores.</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <span>📝</span>
                                    <p>Utilize o conteúdo completo para detalhar inscrições, prazos e requisitos.</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <span>📣</span>
                                    <p>Inclua links ou imagens que ajudem na divulgação do evento.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="sticky top-[26rem]">
                            <CardHeader>
                                <CardTitle>Salvar evento</CardTitle>
                                <CardDescription>Revise os dados antes de publicar</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button type="submit" className="w-full" disabled={processing}>
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
