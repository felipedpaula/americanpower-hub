/** @jsxImportSource react */
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HubLogin({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/hub/login');
    };

    return (
        <>
            <Head title="Login - Hub American Power" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-background to-red-50">
                <div className="w-full max-w-md px-4">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-primary mb-2">
                            American Power Hub
                        </h1>
                        <p className="text-muted-foreground">
                            Portal do Aluno e Professor
                        </p>
                    </div>

                    <Card className="shadow-lg">
                        <CardHeader className="space-y-1">
                            <CardTitle className="text-2xl font-bold">Bem-vindo!</CardTitle>
                            <CardDescription>
                                Faça login para acessar suas atividades e turmas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status && (
                                <div className="mb-4 p-3 rounded-md bg-green-50 text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            {errors.email && !errors.password && (
                                <div className="mb-4 p-3 rounded-md bg-red-50 text-sm font-medium text-red-600">
                                    {errors.email}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="seu@email.com"
                                    />
                                    {errors.email && errors.password && (
                                        <p className="text-sm text-destructive">{errors.email}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Senha</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password}</p>
                                    )}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-input"
                                    />
                                    <Label htmlFor="remember" className="font-normal cursor-pointer">
                                        Lembrar-me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing ? 'Entrando...' : 'Entrar no Hub'}
                                </Button>
                            </form>

                            <div className="mt-6 pt-6 border-t border-border">
                                <p className="text-center text-sm text-muted-foreground">
                                    Acesso para: <span className="font-medium">Alunos, Professores e Administradores</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-4 text-center">
                        <a
                            href="/cms"
                            className="text-sm text-primary hover:underline"
                        >
                            Acessar CMS (Administração)
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
