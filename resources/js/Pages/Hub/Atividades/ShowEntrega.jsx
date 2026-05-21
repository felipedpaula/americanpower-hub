/** @jsxImportSource react */
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import HubLayout from '@/Layouts/HubLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const tipoLabels = {
    traducao: 'Tradução',
    complete: 'Completar lacunas',
    pergunta_resposta: 'Perguntas abertas',
    alternativa: 'Alternativas',
};

const formatDateTime = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
};

const statusVariant = (status) => {
    if (status === 'entregue') return 'default';
    if (status === 'pendente') return 'secondary';
    return 'outline';
};

export default function ShowEntrega({ atividade, atividadeAluno, respostas = {} }) {
    const { props } = usePage();
    const flash = props.flash || {};
    const pageErrors = props.errors || {};

    const notaForm = useForm({
        nota_total: atividadeAluno?.nota_total ?? '',
    });

    const submitNota = (event) => {
        event.preventDefault();
        notaForm.put(
            `/hub/atividades/${atividade.id}/alunos/${atividadeAluno.aluno_id}/nota`,
            { preserveScroll: true }
        );
    };

    const blocos = atividade?.blocos ?? [];
    const aluno = atividadeAluno?.aluno;
    const entregue = atividadeAluno?.status === 'entregue';

    return (
        <HubLayout>
            <Head title={`Entrega: ${aluno?.name ?? 'Aluno'} — ${atividade?.titulo}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            <Link href={`/hub/atividades/${atividade.id}`} className="hover:underline">
                                {atividade.titulo}
                            </Link>
                            {' / '}
                            <span>Entrega do aluno</span>
                        </p>
                        <h1 className="text-2xl font-bold text-foreground">
                            {aluno?.name ?? `Aluno #${atividadeAluno?.aluno_id}`}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {atividade.turma_criada?.turma?.nome ?? 'Turma não informada'}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/hub/atividades/${atividade.id}`}>
                            <Button variant="outline" type="button">Voltar para a atividade</Button>
                        </Link>
                    </div>
                </div>

                {/* Flash */}
                {(flash.success || flash.error || pageErrors.error || pageErrors.nota_total) && (
                    <div
                        className={`rounded-md border p-4 text-sm ${
                            flash.success
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600'
                                : 'border-destructive/40 bg-destructive/10 text-destructive'
                        }`}
                    >
                        {flash.success ?? flash.error ?? pageErrors.error ?? pageErrors.nota_total}
                    </div>
                )}

                {/* Info + Nota */}
                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Entrega</CardTitle>
                            <CardDescription>Dados da submissão</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <InfoLine label="Aluno" value={aluno?.name ?? '—'} />
                            <InfoLine label="E-mail" value={aluno?.email ?? '—'} />
                            <div>
                                <span className="text-muted-foreground">Status</span>
                                <div className="mt-1">
                                    <Badge variant={statusVariant(atividadeAluno?.status)}>
                                        {atividadeAluno?.status ?? '—'}
                                    </Badge>
                                </div>
                            </div>
                            <InfoLine label="Entregue em" value={formatDateTime(atividadeAluno?.data_submissao)} />
                            <InfoLine label="Nota máxima" value={atividade.nota_max ?? '—'} />
                            <InfoLine label="Nota lançada" value={atividadeAluno?.nota_total ?? 'Não lançada'} />
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Nota final</CardTitle>
                            <CardDescription>
                                {entregue
                                    ? 'Atribua a nota após revisar as respostas abaixo.'
                                    : 'A nota só pode ser lançada após a entrega do aluno.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submitNota} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                                <div className="w-full sm:w-48">
                                    <Label htmlFor="nota_total">
                                        Nota (máx. {atividade.nota_max})
                                    </Label>
                                    <Input
                                        id="nota_total"
                                        type="number"
                                        min="0"
                                        max={atividade.nota_max}
                                        step="0.01"
                                        value={notaForm.data.nota_total}
                                        onChange={(e) => notaForm.setData('nota_total', e.target.value)}
                                        disabled={!entregue}
                                        placeholder="0.00"
                                    />
                                    {notaForm.errors.nota_total && (
                                        <p className="mt-1 text-sm text-destructive">{notaForm.errors.nota_total}</p>
                                    )}
                                </div>
                                <Button
                                    type="submit"
                                    disabled={!entregue || notaForm.processing}
                                >
                                    {notaForm.processing ? 'Salvando...' : 'Salvar nota'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Respostas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Respostas do aluno</CardTitle>
                        <CardDescription>
                            {entregue
                                ? `Entregue em ${formatDateTime(atividadeAluno?.data_submissao)}`
                                : 'O aluno ainda não entregou esta atividade.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {blocos.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhum bloco cadastrado.</p>
                        ) : blocos.map((bloco) => {
                            const respostaBloco = respostas[bloco.id] ?? respostas[String(bloco.id)] ?? null;
                            return (
                                <BlocoEntregaCard
                                    key={bloco.id}
                                    bloco={bloco}
                                    resposta={respostaBloco}
                                    entregue={entregue}
                                />
                            );
                        })}
                    </CardContent>
                </Card>
            </div>
        </HubLayout>
    );
}

function InfoLine({ label, value }) {
    return (
        <div>
            <span className="text-muted-foreground">{label}</span>
            <p className="font-medium text-foreground">{value}</p>
        </div>
    );
}

function BlocoEntregaCard({ bloco, resposta, entregue }) {
    return (
        <div className="rounded-lg border border-border p-4 space-y-4">
            {/* Cabeçalho do bloco */}
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Bloco {bloco.ordem}</Badge>
                <Badge variant="outline">{tipoLabels[bloco.tipo] ?? bloco.tipo}</Badge>
                {bloco.titulo && (
                    <span className="text-sm font-medium text-foreground">{bloco.titulo}</span>
                )}
            </div>

            {/* Enunciado */}
            <div>
                <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Enunciado</p>
                <BlocoConteudo bloco={bloco} />
            </div>

            {/* Resposta */}
            <div className="border-t border-border pt-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                    Resposta do aluno
                </p>
                {!entregue ? (
                    <p className="text-sm italic text-muted-foreground">Não entregue.</p>
                ) : resposta === null ? (
                    <p className="text-sm italic text-muted-foreground">Sem resposta registrada.</p>
                ) : (
                    <RespostaView bloco={bloco} resposta={resposta} />
                )}
            </div>
        </div>
    );
}

function BlocoConteudo({ bloco }) {
    if (bloco.tipo === 'pergunta_resposta') {
        return (
            <ol className="list-decimal space-y-1 pl-5 text-sm text-foreground">
                {(bloco.conteudo?.perguntas ?? []).map((pergunta, i) => (
                    <li key={i}>{pergunta}</li>
                ))}
            </ol>
        );
    }

    if (bloco.tipo === 'alternativa') {
        return (
            <div className="space-y-3">
                {(bloco.conteudo?.perguntas ?? []).map((pergunta, i) => (
                    <div key={i} className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{i + 1}. {pergunta.pergunta}</p>
                        <ul className="space-y-0.5 pl-4 text-sm text-muted-foreground">
                            {(pergunta.opcoes ?? []).map((opcao, oi) => (
                                <li key={oi}>{String.fromCharCode(65 + oi)}. {opcao}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }

    if (bloco.tipo === 'complete') {
        return (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground">
                {(bloco.conteudo?.textos ?? []).map((texto, i) => {
                    const partes = texto.split('__');
                    return (
                        <li key={i} className="leading-relaxed">
                            <span className="inline-flex flex-wrap items-baseline gap-x-1">
                                {partes.map((parte, pi) => (
                                    <span key={pi} className="inline-flex items-baseline gap-x-1">
                                        <span>{parte}</span>
                                        {pi < partes.length - 1 && (
                                            <span className="inline-block min-w-[80px] border-b-2 border-foreground/40" />
                                        )}
                                    </span>
                                ))}
                            </span>
                        </li>
                    );
                })}
            </ol>
        );
    }

    // traducao
    return (
        <div className="rounded-md bg-muted/60 p-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {bloco.conteudo?.texto}
            </p>
        </div>
    );
}

function RespostaView({ bloco, resposta }) {
    if (bloco.tipo === 'traducao') {
        return (
            <p className="whitespace-pre-wrap text-sm text-foreground">
                {resposta?.texto || <span className="italic text-muted-foreground">—</span>}
            </p>
        );
    }

    if (bloco.tipo === 'pergunta_resposta') {
        return (
            <div className="space-y-3">
                {(bloco.conteudo?.perguntas ?? []).map((pergunta, i) => {
                    const item = resposta?.respostas?.[i];
                    return (
                        <div key={i} className="rounded-md bg-muted/40 p-3">
                            <p className="mb-1 text-xs font-medium text-muted-foreground">{pergunta}</p>
                            <p className="text-sm text-foreground whitespace-pre-wrap">
                                {item?.resposta || <span className="italic text-muted-foreground">Sem resposta</span>}
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    }

    if (bloco.tipo === 'alternativa') {
        return (
            <div className="space-y-3">
                {(bloco.conteudo?.perguntas ?? []).map((pergunta, i) => {
                    const item = resposta?.respostas?.[i];
                    const opcaoIndex = item?.opcao_selecionada_index;
                    const opcao = pergunta?.opcoes?.[opcaoIndex];
                    const letraOpcao = opcaoIndex !== undefined && opcaoIndex !== '' && opcaoIndex !== null
                        ? String.fromCharCode(65 + Number(opcaoIndex))
                        : null;

                    return (
                        <div key={i} className="rounded-md bg-muted/40 p-3">
                            <p className="mb-1 text-xs font-medium text-muted-foreground">{i + 1}. {pergunta.pergunta}</p>
                            {opcao ? (
                                <p className="text-sm font-medium text-foreground">
                                    <span className="mr-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                        {letraOpcao}
                                    </span>
                                    {opcao}
                                </p>
                            ) : (
                                <p className="text-sm italic text-muted-foreground">Sem resposta</p>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    if (bloco.tipo === 'complete') {
        return (
            <ol className="list-decimal space-y-2 pl-5">
                {(bloco.conteudo?.textos ?? []).map((texto, i) => {
                    const item = resposta?.respostas?.[i];
                    const valor = item?.resposta;
                    const partes = texto.split('__');

                    return (
                        <li key={i} className="leading-loose">
                            <span className="inline-flex flex-wrap items-baseline gap-x-1 text-sm text-foreground">
                                {partes.map((parte, pi) => (
                                    <span key={pi} className="inline-flex items-baseline gap-x-1">
                                        <span>{parte}</span>
                                        {pi < partes.length - 1 && (
                                            <span className={`inline-block min-w-[64px] border-b-2 px-1 text-center text-sm font-semibold ${valor ? 'border-primary text-primary' : 'border-foreground/40 text-muted-foreground italic'}`}>
                                                {pi === 0 ? (valor ?? '—') : '—'}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </span>
                        </li>
                    );
                })}
            </ol>
        );
    }

    return null;
}
