/** @jsxImportSource react */
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CMSLayout from '@/Layouts/CMSLayout';

export default function Create({ userTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        user_type_id: userTypes?.[0]?.id ?? '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/cms/usuarios');
    };

    return (
        <CMSLayout>
            <Head title="Novo Usuário - CMS" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Novo Usuário</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Cadastre alunos, professores ou colaboradores para o CMS
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
                                <CardTitle>Informações do Usuário</CardTitle>
                                <CardDescription>Preencha os dados básicos do usuário</CardDescription>
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
                                            placeholder="Nome do usuário"
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
                                            placeholder="usuario@americanpower.com"
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
                                        <Label htmlFor="password">
                                            Senha inicial <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Mínimo 6 caracteres"
                                            className={errors.password ? 'border-red-500' : ''}
                                        />
                                        {errors.password && (
                                            <p className="text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">
                                        Confirmar senha <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Repita a senha"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Boas práticas</CardTitle>
                                <CardDescription>Orientações rápidas para cadastro</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <div className="flex items-start space-x-3">
                                    <span>✅</span>
                                    <p>Utilize e-mails institucionais sempre que possível.</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <span>🔐</span>
                                    <p>Defina uma senha inicial forte e compartilhe-a com o usuário com segurança.</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <span>🆔</span>
                                    <p>Selecione o tipo correto para garantir os níveis de permissão adequados.</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="sticky top-[22rem]">
                            <CardHeader>
                                <CardTitle>Salvar cadastro</CardTitle>
                                <CardDescription>Revise as informações antes de salvar</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Button type="submit" className="w-full" disabled={processing}>
                                    {processing ? '⏳ Salvando...' : '✅ Criar usuário'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </CMSLayout>
    );
}
