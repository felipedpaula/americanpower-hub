/** @jsxImportSource react */
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import HubLayout from '@/Layouts/HubLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring";

export default function CreateQuestao({ atividade }) {
    const { props } = usePage();
    const flash = props.flash || {};

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        enunciado: '',
        valor: '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        post(`/hub/atividades/${atividade?.id}/questoes`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                clearErrors();
            },
        });
    };

    if (!atividade) {
        return (
            <HubLayout>
                <Head title="Atividade não encontrada" />
                <div className="rounded-lg border border-border bg-card p-6 text-center">
                    <h1 className="text-lg font-semibold text-foreground">
                        Não foi possível carregar as informações desta atividade.
                    </h1>
                    <div className="mt-4">
                        <Link href="/hub/atividades">
                            <Button variant="outline">Voltar para atividades</Button>
                        </Link>
                    </div>
                </div>
            </HubLayout>
        );
    }

    return (
        <HubLayout>
            <Head title={`Nova questão - ${atividade.titulo}`} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Nova questão</h1>
                        <p className="text-muted-foreground text-sm">
                            {`Crie uma questão para a atividade "${atividade.titulo}".`}
                        </p>
                        {atividade.turma?.nome && (
                            <p className="text-muted-foreground text-xs">
                                Turma: {atividade.turma.nome}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/hub/atividades/${atividade.id}`}>
                            <Button variant="outline" type="button">
                                Voltar para atividade
                            </Button>
                        </Link>
                        <Button type="button" onClick={handleSubmit} disabled={processing}>
                            Salvar questão
                        </Button>
                    </div>
                </div>

                {(flash.success || flash.error) && (
                    <div
                        className={`rounded-md border p-4 text-sm ${
                            flash.success
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600'
                                : 'border-destructive/40 bg-destructive/10 text-destructive'
                        }`}
                    >
                        {flash.success ?? flash.error}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Informações da questão</CardTitle>
                        <CardDescription>Defina o enunciado e o valor da questão.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="enunciado">Enunciado</Label>
                                <textarea
                                    id="enunciado"
                                    value={data.enunciado}
                                    onChange={(event) => setData('enunciado', event.target.value)}
                                    placeholder="Descreva o enunciado da questão"
                                    className={`${inputClass} min-h-[160px] resize-y`}
                                />
                                {errors.enunciado && (
                                    <p className="mt-2 text-sm text-destructive">{errors.enunciado}</p>
                                )}
                            </div>

                            <div className="max-w-xs">
                                <Label htmlFor="valor">Valor da questão</Label>
                                <Input
                                    id="valor"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.valor}
                                    onChange={(event) => setData('valor', event.target.value)}
                                    placeholder="Ex: 2"
                                />
                                {errors.valor && (
                                    <p className="mt-2 text-sm text-destructive">{errors.valor}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2">
                                <Link href={`/hub/atividades/${atividade.id}`}>
                                    <Button variant="outline" type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Salvando...' : 'Criar questão'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </HubLayout>
    );
}
