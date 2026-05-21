/** @jsxImportSource react */
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

            <div className="min-h-screen flex bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
                {/* Overlay decorativo */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-red-600/20 pointer-events-none" />

                {/* Círculos decorativos */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-700/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-12">
                    {/* Logo */}
                    <div className="mb-10 flex flex-col items-center">
                        <a href="/">
                            <img
                                src="/assets/img/logo-american-power-branca.png"
                                alt="American Power Logo"
                                className="h-12 w-auto drop-shadow-2xl"
                            />
                        </a>
                        <span className="mt-4 inline-flex items-center gap-2 bg-red-500/20 text-red-300 text-sm font-semibold px-4 py-1.5 rounded-full border border-red-500/30">
                            🚀 Portal do Aluno e Professor
                        </span>
                    </div>

                    {/* Card */}
                    <div className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl p-8">
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold text-white mb-1">Bem-vindo!</h2>
                            <p className="text-blue-200 text-sm">Faça login para acessar suas atividades e turmas</p>
                        </div>

                        {status && (
                            <div className="mb-5 p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-sm font-medium text-green-300">
                                {status}
                            </div>
                        )}

                        {errors.email && !errors.password && (
                            <div className="mb-5 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-sm font-medium text-red-300">
                                {errors.email}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-blue-100 font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="seu@email.com"
                                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-red-400 focus:ring-red-400/30 h-11"
                                />
                                {errors.email && errors.password && (
                                    <p className="text-sm text-red-400">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-blue-100 font-medium">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-white/10 border-white/20 text-white placeholder:text-blue-300 focus:border-red-400 focus:ring-red-400/30 h-11"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-400">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-white/30 bg-white/10 accent-red-500"
                                />
                                <Label htmlFor="remember" className="font-normal cursor-pointer text-blue-200">
                                    Lembrar-me
                                </Label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full h-11 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-red-500/30"
                            >
                                {processing ? 'Entrando...' : 'Entrar no Hub'}
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-white/20">
                            <p className="text-center text-xs text-blue-300">
                                Acesso para: <span className="font-semibold text-blue-100">Alunos, Professores e Administradores</span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <a
                            href="/cms"
                            className="text-sm text-blue-300 hover:text-red-400 transition-colors"
                        >
                            Acessar CMS (Administração)
                        </a>
                    </div>

                    <div className="mt-8 text-center">
                        <a href="/" className="text-xs text-blue-400 hover:text-blue-200 transition-colors">
                            ← Voltar ao site
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
