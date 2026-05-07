/** @jsxImportSource react */
import { Head, Link } from '@inertiajs/react';

const pageContent = {
    cms: {
        label: 'CMS',
        title: 'Página do CMS não encontrada.',
        description: 'A rota que você tentou abrir não existe ou foi removida. Use a entrada principal do CMS para continuar.',
        primaryHref: '/cms',
        primaryLabel: 'Ir para o CMS',
    },
    hub: {
        label: 'Hub',
        title: 'Página do Hub não encontrada.',
        description: 'A rota que você tentou abrir não existe ou foi removida. Volte pela entrada principal do Hub para continuar.',
        primaryHref: '/hub',
        primaryLabel: 'Ir para o Hub',
    },
    default: {
        label: 'Sistema',
        title: 'Página não encontrada.',
        description: 'O recurso solicitado não existe ou deixou de estar disponível.',
        primaryHref: '/',
        primaryLabel: 'Ir para o início',
    },
};

export default function Error({ status = 404, context = 'default' }) {
    const content = pageContent[context] ?? pageContent.default;

    return (
        <>
            <Head title="Página não encontrada" />

            <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 py-16 text-foreground">
                <div className="absolute left-[-6rem] top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute right-[-5rem] top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-accent/15 blur-3xl" />

                <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-card/95 shadow-2xl">
                    <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                        <div className="p-8 sm:p-10 lg:p-12">
                            <span className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                                {content.label}
                            </span>

                            <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                                {content.title}
                            </h1>

                            <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                                {content.description}
                            </p>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={content.primaryHref}
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-smooth hover:bg-primary/90"
                                >
                                    {content.primaryLabel}
                                </Link>

                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground transition-smooth hover:bg-accent hover:text-accent-foreground"
                                >
                                    Voltar
                                </button>
                            </div>
                        </div>

                        <div className="border-t border-border bg-muted/40 p-8 sm:p-10 lg:border-l lg:border-t-0">
                            <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
                                <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                                    Erro
                                </p>
                                <p className="mt-3 text-7xl font-black tracking-tight text-foreground">
                                    {status}
                                </p>
                                <div className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
                                    <p>Verifique se a URL foi digitada corretamente.</p>
                                    <p>Se a sessão expirou, volte pela entrada principal da área.</p>
                                    <p>Se o problema persistir, a rota pode ter sido removida.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
