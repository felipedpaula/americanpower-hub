/** @jsxImportSource react */
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CMSLayout from '@/Layouts/CMSLayout';

export default function Edit({ usuario, userTypes }) {
    const { data, setData, put, processing, errors } = useForm({
        name: usuario.name || '',
        email: usuario.email || '',
        user_type_id: usuario.user_type_id || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/cms/usuarios/${usuario.id}`);
    };

    return (
        <CMSLayout>
            <Head title={`Editar ${usuario.name} - CMS`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Editar Usuário</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Atualize as informações de alunos, professores ou colaboradores
                        </p>
                    </div>
                    <Link href="/cms/usuarios">
                        <Button variant="outline">← Voltar</Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Dados do Usuário</CardTitle>
                                <CardDescription>Altere os dados necessários e salve as alterações</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">
                                            Nome completo <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className={errors.name ? 'border-red-500' : ''}
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">
                                            Email <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="user_type_id">
                                            Tipo de usuário <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            id="user_type_id"
                                            value={data.user_type_id}
                                            onChange={(e) => setData('user_type_id', e.target.value)}
                                            className={errors.user_type_id ? 'border-red-500' : ''}
                                        >
                                            {userTypes.map((type) => (
                                                <option key={type.id} value={type.id}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.user_type_id && (
                                            <p className="text-sm text-red-600">{errors.user_type_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Nova senha</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Deixe em branco para manter a atual"
                                            className={errors.password ? 'border-red-500' : ''}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirmar nova senha</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Repita a nova senha"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Resumo</CardTitle>
                                <CardDescription>Informações principais do usuário</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Tipo atual:</span>
                                    <span className="font-medium text-gray-900">{usuario.user_type_label}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Cadastrado em:</span>
                                    <span className="font-medium text-gray-900">{usuario.created_at || '—'}</span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    Apenas usuários root e admin podem alterar categorias e redefinir senhas.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="sticky top-[22rem]">
                            <CardHeader>
                                <CardTitle>Salvar alterações</CardTitle>
                                <CardDescription>Confirme as mudanças realizadas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? '⏳ Salvando...' : '💾 Atualizar usuário'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </CMSLayout>
    );
}
