/** @jsxImportSource react */
import { Head, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CMSLayout from '@/Layouts/CMSLayout';

export default function Edit({ setting, calendarOptions }) {
    const { props } = usePage();
    const { data, setData, put, processing, errors } = useForm({
        nome_escola: setting?.nome_escola || '',
        nome_diretora: setting?.nome_diretora || '',
        cnpj: setting?.cnpj || '',
        site: setting?.site || '',
        endereco: setting?.endereco || '',
        cidade: setting?.cidade || '',
        estado: setting?.estado || '',
        telefone: setting?.telefone || '',
        whatsapp: setting?.whatsapp || '',
        email: setting?.email || '',
        instagram: setting?.instagram || '',
        facebook: setting?.facebook || '',
        modelo_calendario: setting?.modelo_calendario || '',
        ano_letivo_atual: setting?.ano_letivo_atual || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put('/cms/configuracoes');
    };

    return (
        <CMSLayout>
            <Head title="Configurações da Escola - CMS" />

            <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Configurações</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Atualize os dados institucionais e de contato da escola
                        </p>
                    </div>
                </div>

                {props.flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {props.flash.success}
                    </div>
                )}

                {props.flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {props.flash.error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Institucionais</CardTitle>
                                <CardDescription>Dados gerais utilizados em páginas públicas e relatórios</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="nome_escola">
                                            Nome da escola <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="nome_escola"
                                            value={data.nome_escola}
                                            onChange={(e) => setData('nome_escola', e.target.value)}
                                            className={errors.nome_escola ? 'border-red-500' : ''}
                                        />
                                        {errors.nome_escola && (
                                            <p className="text-sm text-red-600">{errors.nome_escola}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="nome_diretora">
                                            Nome da diretora <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="nome_diretora"
                                            value={data.nome_diretora}
                                            onChange={(e) => setData('nome_diretora', e.target.value)}
                                            className={errors.nome_diretora ? 'border-red-500' : ''}
                                        />
                                        {errors.nome_diretora && (
                                            <p className="text-sm text-red-600">{errors.nome_diretora}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="cnpj">CNPJ</Label>
                                        <Input
                                            id="cnpj"
                                            value={data.cnpj}
                                            onChange={(e) => setData('cnpj', e.target.value)}
                                            className={errors.cnpj ? 'border-red-500' : ''}
                                        />
                                        {errors.cnpj && <p className="text-sm text-red-600">{errors.cnpj}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="site">Site</Label>
                                        <Input
                                            id="site"
                                            value={data.site}
                                            onChange={(e) => setData('site', e.target.value)}
                                            placeholder="https://"
                                            className={errors.site ? 'border-red-500' : ''}
                                        />
                                        {errors.site && <p className="text-sm text-red-600">{errors.site}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endereco">
                                        Endereço completo <span className="text-red-500">*</span>
                                    </Label>
                                    <textarea
                                        id="endereco"
                                        value={data.endereco}
                                        onChange={(e) => setData('endereco', e.target.value)}
                                        rows={3}
                                        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${errors.endereco ? 'border-red-500' : ''}`}
                                    />
                                    {errors.endereco && <p className="text-sm text-red-600">{errors.endereco}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="cidade">
                                            Cidade <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="cidade"
                                            value={data.cidade}
                                            onChange={(e) => setData('cidade', e.target.value)}
                                            className={errors.cidade ? 'border-red-500' : ''}
                                        />
                                        {errors.cidade && <p className="text-sm text-red-600">{errors.cidade}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="estado">
                                            Estado <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="estado"
                                            value={data.estado}
                                            onChange={(e) => setData('estado', e.target.value)}
                                            className={errors.estado ? 'border-red-500' : ''}
                                        />
                                        {errors.estado && <p className="text-sm text-red-600">{errors.estado}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="modelo_calendario">
                                            Modelo de calendário <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="modelo_calendario"
                                            value={data.modelo_calendario}
                                            onChange={(e) => setData('modelo_calendario', e.target.value)}
                                            className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.modelo_calendario ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Selecione</option>
                                            {calendarOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.modelo_calendario && (
                                            <p className="text-sm text-red-600">{errors.modelo_calendario}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="ano_letivo_atual">
                                            Ano letivo atual <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="ano_letivo_atual"
                                            value={data.ano_letivo_atual}
                                            onChange={(e) => setData('ano_letivo_atual', e.target.value)}
                                            className={errors.ano_letivo_atual ? 'border-red-500' : ''}
                                        />
                                        {errors.ano_letivo_atual && (
                                            <p className="text-sm text-red-600">{errors.ano_letivo_atual}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Contatos e Redes Sociais</CardTitle>
                                <CardDescription>Informações visíveis para a comunidade escolar</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="telefone">Telefone</Label>
                                        <Input
                                            id="telefone"
                                            value={data.telefone}
                                            onChange={(e) => setData('telefone', e.target.value)}
                                            className={errors.telefone ? 'border-red-500' : ''}
                                        />
                                        {errors.telefone && (
                                            <p className="text-sm text-red-600">{errors.telefone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp">WhatsApp</Label>
                                        <Input
                                            id="whatsapp"
                                            value={data.whatsapp}
                                            onChange={(e) => setData('whatsapp', e.target.value)}
                                            className={errors.whatsapp ? 'border-red-500' : ''}
                                        />
                                        {errors.whatsapp && (
                                            <p className="text-sm text-red-600">{errors.whatsapp}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                    />
                                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="instagram">Instagram</Label>
                                        <Input
                                            id="instagram"
                                            value={data.instagram}
                                            onChange={(e) => setData('instagram', e.target.value)}
                                            className={errors.instagram ? 'border-red-500' : ''}
                                        />
                                        {errors.instagram && (
                                            <p className="text-sm text-red-600">{errors.instagram}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="facebook">Facebook</Label>
                                        <Input
                                            id="facebook"
                                            value={data.facebook}
                                            onChange={(e) => setData('facebook', e.target.value)}
                                            className={errors.facebook ? 'border-red-500' : ''}
                                        />
                                        {errors.facebook && (
                                            <p className="text-sm text-red-600">{errors.facebook}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Publicação</CardTitle>
                                <CardDescription>Confirme para salvar as alterações</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    As informações atualizadas serão exibidas no site e utilizadas nos relatórios do sistema.
                                </p>
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? '⏳ Salvando...' : '💾 Salvar configurações'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </CMSLayout>
    );
}
