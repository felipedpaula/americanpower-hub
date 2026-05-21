/** @jsxImportSource react */
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import HubLayout from '@/Layouts/HubLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

const tipoLabels = {
    traducao: 'Tradução',
    complete: 'Completar lacunas',
    pergunta_resposta: 'Perguntas abertas',
    alternativa: 'Alternativas',
};

const formatDateTime = (value) => {
    if (!value) return 'Sem prazo';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Sem prazo';

    return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
};

const statusVariant = (status) => {
    if (status === 'entregue') return 'default';
    if (status === 'pendente') return 'secondary';
    return 'outline';
};

const defaultResposta = (bloco) => {
    if (bloco.tipo === 'pergunta_resposta') {
        return {
            respostas: (bloco.conteudo?.perguntas ?? []).map((_, index) => ({
                pergunta_index: index,
                resposta: '',
            })),
        };
    }

    if (bloco.tipo === 'alternativa') {
        return {
            respostas: (bloco.conteudo?.perguntas ?? []).map((_, index) => ({
                pergunta_index: index,
                opcao_selecionada_index: '',
            })),
        };
    }

    if (bloco.tipo === 'complete') {
        return {
            respostas: (bloco.conteudo?.textos ?? []).map((_, index) => ({
                texto_index: index,
                resposta: '',
            })),
        };
    }

    return { texto: '' };
};

const buildInitialRespostas = (blocos = [], respostasAluno = {}) => {
    return blocos.reduce((acc, bloco) => {
        acc[bloco.id] = respostasAluno?.[bloco.id] ?? respostasAluno?.[String(bloco.id)] ?? defaultResposta(bloco);
        return acc;
    }, {});
};

export default function ShowAtividade({
    atividade,
    estatisticas,
    atividadeAluno,
    respostasAluno = {},
    alunos = [],
}) {
    const { props } = usePage();
    const userType = props.user?.type || props.auth?.user?.user_type?.name;
    const flash = props.flash || {};
    const pageErrors = props.errors || {};
    const isAluno = userType === 'aluno';
    const canManage = ['professor', 'admin', 'root'].includes(userType);
    const blocos = atividade?.blocos ?? [];

    const respostaForm = useForm({
        respostas: buildInitialRespostas(blocos, respostasAluno),
    });

    const [deletingAtividade, setDeletingAtividade] = useState(false);
    const [deletingBlocoId, setDeletingBlocoId] = useState(null);

    const handleDeleteAtividade = () => {
        if (!window.confirm(`Tem certeza que deseja excluir a atividade "${atividade.titulo}"? Todas as respostas e dados dos alunos serão apagados permanentemente.`)) {
            return;
        }
        setDeletingAtividade(true);
        router.delete(`/hub/atividades/${atividade.id}`, {
            onFinish: () => setDeletingAtividade(false),
        });
    };

    const handleDeleteBloco = (bloco) => {
        if (!window.confirm(`Tem certeza que deseja excluir o Bloco ${bloco.ordem}${bloco.titulo ? ` "${bloco.titulo}"` : ''}?`)) {
            return;
        }
        setDeletingBlocoId(bloco.id);
        router.delete(`/hub/atividades/${atividade.id}/blocos/${bloco.id}`, {
            preserveScroll: true,
            onFinish: () => setDeletingBlocoId(null),
        });
    };

    if (!atividade) {
        return (
            <HubLayout>
                <Head title="Atividade não encontrada" />
                <div className="rounded-lg border border-border bg-card p-6 text-center">
                    <h1 className="text-lg font-semibold text-foreground">
                        Não foi possível carregar esta atividade.
                    </h1>
                    <Link href="/hub/atividades" className="mt-4 inline-block">
                        <Button variant="outline">Voltar para atividades</Button>
                    </Link>
                </div>
            </HubLayout>
        );
    }

    const updateResposta = (blocoId, resposta) => {
        respostaForm.setData('respostas', {
            ...respostaForm.data.respostas,
            [blocoId]: resposta,
        });
    };

    const submitRespostas = (event) => {
        event.preventDefault();
        respostaForm.post(`/hub/atividades/${atividade.id}/submeter`, {
            preserveScroll: true,
        });
    };

    const delivered = atividadeAluno?.status === 'entregue';

    return (
        <HubLayout>
            <Head title={`Atividade: ${atividade.titulo}`} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{atividade.titulo}</h1>
                        <p className="text-sm text-muted-foreground">
                            {atividade.turma_criada?.turma?.nome ?? 'Turma não informada'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href="/hub/atividades">
                            <Button variant="outline" type="button">Voltar</Button>
                        </Link>
                        {atividade.pode_editar && (
                            <Link href={`/hub/atividades/${atividade.id}/edit`}>
                                <Button type="button">Editar atividade</Button>
                            </Link>
                        )}
                        {atividade.pode_excluir && (
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDeleteAtividade}
                                disabled={deletingAtividade}
                            >
                                {deletingAtividade ? 'Excluindo...' : 'Excluir atividade'}
                            </Button>
                        )}
                    </div>
                </div>

                {(flash.success || flash.error || respostaForm.errors.error || pageErrors.error || pageErrors.nota_total) && (
                    <div
                        className={`rounded-md border p-4 text-sm ${
                            flash.success
                                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600'
                                : 'border-destructive/40 bg-destructive/10 text-destructive'
                        }`}
                    >
                        {flash.success ?? flash.error ?? respostaForm.errors.error ?? pageErrors.error ?? pageErrors.nota_total}
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações</CardTitle>
                            <CardDescription>Dados principais da atividade</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <InfoLine label="Professor" value={atividade.professor?.name ?? atividade.turma_criada?.professor?.name ?? 'Não informado'} />
                            <InfoLine label="Prazo" value={formatDateTime(atividade.data_entrega)} />
                            <InfoLine label="Nota máxima" value={atividade.nota_max ?? '—'} />
                            {atividadeAluno && (
                                <>
                                    <div>
                                        <span className="text-muted-foreground">Status</span>
                                        <div className="mt-1">
                                            <Badge variant={statusVariant(atividadeAluno.status)}>
                                                {atividadeAluno.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <InfoLine label="Nota final" value={atividadeAluno.nota_total ?? '—'} />
                                    <InfoLine label="Entregue em" value={formatDateTime(atividadeAluno.data_submissao)} />
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Orientações</CardTitle>
                            <CardDescription>Descrição e instruções do professor</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <TextBlock label="Descrição" value={atividade.descricao} empty="Nenhuma descrição fornecida." />
                            <TextBlock label="Instruções" value={atividade.instrucoes} empty="Nenhuma instrução adicional." />
                        </CardContent>
                    </Card>
                </div>

                {canManage && estatisticas && (
                    <div className="grid gap-4 md:grid-cols-3">
                        <StatCard label="Total de alunos" value={estatisticas.total_alunos ?? 0} />
                        <StatCard label="Entregues" value={estatisticas.entregues ?? 0} />
                        <StatCard label="Pendentes" value={estatisticas.pendentes ?? 0} />
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Blocos da atividade</CardTitle>
                        <CardDescription>
                            {isAluno
                                ? delivered ? 'Suas respostas ficam disponíveis para consulta.' : 'Responda todos os blocos antes de entregar.'
                                : 'Conteúdo publicado para os alunos.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {blocos.length === 0 ? (
                            <p className="text-sm text-muted-foreground">Nenhum bloco cadastrado.</p>
                        ) : isAluno ? (
                            <form onSubmit={submitRespostas} className="space-y-5">
                                {blocos.map((bloco) => (
                                    <AtividadeBlocoCard
                                        key={bloco.id}
                                        bloco={bloco}
                                        hideConteudo={['pergunta_resposta', 'alternativa', 'complete'].includes(bloco.tipo)}
                                    >
                                        <RespostaEditor
                                            bloco={bloco}
                                            resposta={respostaForm.data.respostas[bloco.id] ?? defaultResposta(bloco)}
                                            errors={respostaForm.errors}
                                            disabled={delivered}
                                            onChange={(resposta) => updateResposta(bloco.id, resposta)}
                                        />
                                    </AtividadeBlocoCard>
                                ))}

                                {!delivered && (
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={respostaForm.processing}>
                                            {respostaForm.processing ? 'Entregando...' : 'Entregar atividade'}
                                        </Button>
                                    </div>
                                )}
                            </form>
                        ) : (
                            <div className="space-y-5">
                                {blocos.map((bloco) => (
                                    <AtividadeBlocoCard
                                        key={bloco.id}
                                        bloco={bloco}
                                        hideConteudo={false}
                                        onDelete={atividade.pode_editar_estrutura ? () => handleDeleteBloco(bloco) : undefined}
                                        deleting={deletingBlocoId === bloco.id}
                                    />
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {canManage && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Entregas</CardTitle>
                            <CardDescription>
                                Clique em “Ver entrega” para revisar as respostas e atribuir a nota.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {alunos.length === 0 ? (
                                <p className="text-sm text-muted-foreground">Nenhum aluno vinculado a esta atividade.</p>
                            ) : (
                                <div className="space-y-3">
                                    {alunos.map((alunoEntrega) => (
                                        <div
                                            key={alunoEntrega.id}
                                            className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-medium text-foreground">
                                                        {alunoEntrega.aluno?.name ?? `Aluno #${alunoEntrega.aluno_id}`}
                                                    </p>
                                                    <Badge variant={statusVariant(alunoEntrega.status)}>
                                                        {alunoEntrega.status}
                                                    </Badge>
                                                    {alunoEntrega.nota_total !== null && alunoEntrega.nota_total !== undefined && (
                                                        <span className="text-sm text-muted-foreground">
                                                            Nota: <span className="font-semibold text-foreground">{alunoEntrega.nota_total}</span>
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    {alunoEntrega.status === 'entregue'
                                                        ? `Entregue em: ${formatDateTime(alunoEntrega.data_submissao)}`
                                                        : 'Aguardando entrega'}
                                                </p>
                                            </div>

                                            {alunoEntrega.status === 'entregue' && (
                                                <Link href={`/hub/atividades/${atividade.id}/alunos/${alunoEntrega.aluno_id}`}>
                                                    <Button type="button" variant="outline" size="sm">
                                                        Ver entrega
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}
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

function TextBlock({ label, value, empty }) {
    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
            {value ? (
                <p className="mt-1 whitespace-pre-wrap leading-relaxed text-foreground">{value}</p>
            ) : (
                <p className="mt-1 text-muted-foreground">{empty}</p>
            )}
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardDescription>{label}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold text-foreground">{value}</p>
            </CardContent>
        </Card>
    );
}

function AtividadeBlocoCard({ bloco, children, onDelete, deleting, hideConteudo = false }) {
    return (
        <div className="rounded-lg border border-border p-4">
            <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Bloco {bloco.ordem}</Badge>
                <Badge variant="outline">{tipoLabels[bloco.tipo] ?? bloco.tipo}</Badge>
                {bloco.titulo && (
                    <span className="text-sm font-medium text-foreground">{bloco.titulo}</span>
                )}
                {onDelete && (
                    <button
                        type="button"
                        onClick={onDelete}
                        disabled={deleting}
                        className="ml-auto text-xs text-destructive hover:underline disabled:opacity-50"
                    >
                        {deleting ? 'Excluindo...' : 'Excluir bloco'}
                    </button>
                )}
            </div>

            {!hideConteudo && (
                <div className="mt-4">
                    <BlocoConteudo bloco={bloco} />
                </div>
            )}

            {children && (
                <div className={`${hideConteudo ? 'mt-4' : 'mt-4 border-t border-border pt-4'}`}>
                    {children}
                </div>
            )}
        </div>
    );
}

function BlocoConteudo({ bloco }) {
    if (bloco.tipo === 'pergunta_resposta') {
        return (
            <ol className="list-decimal space-y-2 pl-5 text-sm text-foreground">
                {(bloco.conteudo?.perguntas ?? []).map((pergunta, index) => (
                    <li key={index}>{pergunta}</li>
                ))}
            </ol>
        );
    }

    if (bloco.tipo === 'alternativa') {
        return (
            <div className="space-y-4">
                {(bloco.conteudo?.perguntas ?? []).map((pergunta, index) => (
                    <div key={index} className="space-y-2">
                        <p className="text-sm font-medium text-foreground">{pergunta.pergunta}</p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            {(pergunta.opcoes ?? []).map((opcao, opcaoIndex) => (
                                <li key={opcaoIndex}>{opcaoIndex + 1}. {opcao}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        );
    }

    if (bloco.tipo === 'complete') {
        return (
            <ol className="list-decimal space-y-3 pl-5 text-sm text-foreground">
                {(bloco.conteudo?.textos ?? []).map((texto, index) => {
                    const partes = texto.split('__');
                    return (
                        <li key={index} className="leading-relaxed">
                            <span className="inline-flex flex-wrap items-baseline gap-x-1">
                                {partes.map((parte, i) => (
                                    <span key={i} className="inline-flex items-baseline gap-x-1">
                                        <span>{parte}</span>
                                        {i < partes.length - 1 && (
                                            <span className="inline-block min-w-[80px] border-b-2 border-foreground/50" />
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

    return (
        <div className="rounded-md bg-muted/60 p-3">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {bloco.conteudo?.texto}
            </p>
        </div>
    );
}

function RespostaEditor({ bloco, resposta, errors, disabled, onChange }) {
    if (disabled) {
        return <RespostaReadOnly bloco={bloco} resposta={resposta} />;
    }

    if (bloco.tipo === 'pergunta_resposta') {
        const respostas = resposta.respostas ?? defaultResposta(bloco).respostas;

        const updateResposta = (index, value) => {
            onChange({
                respostas: respostas.map((item, currentIndex) => (
                    currentIndex === index ? { ...item, resposta: value } : item
                )),
            });
        };

        return (
            <div className="space-y-4">
                {(bloco.conteudo?.perguntas ?? []).map((pergunta, index) => (
                    <div key={index}>
                        <Label htmlFor={`resposta-${bloco.id}-${index}`}>{pergunta}</Label>
                        <textarea
                            id={`resposta-${bloco.id}-${index}`}
                            value={respostas[index]?.resposta ?? ''}
                            onChange={(event) => updateResposta(index, event.target.value)}
                            className={`${inputClass} min-h-[90px] resize-y`}
                            placeholder="Digite sua resposta"
                        />
                        {errors[`respostas.${bloco.id}.respostas.${index}.resposta`] && (
                            <p className="mt-2 text-sm text-destructive">
                                {errors[`respostas.${bloco.id}.respostas.${index}.resposta`]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    if (bloco.tipo === 'alternativa') {
        const respostas = resposta.respostas ?? defaultResposta(bloco).respostas;

        const updateResposta = (index, value) => {
            onChange({
                respostas: respostas.map((item, currentIndex) => (
                    currentIndex === index ? { ...item, opcao_selecionada_index: value } : item
                )),
            });
        };

        return (
            <div className="space-y-4">
                {(bloco.conteudo?.perguntas ?? []).map((pergunta, perguntaIndex) => (
                    <div key={perguntaIndex} className="space-y-2">
                        <p className="text-sm font-medium text-foreground">{pergunta.pergunta}</p>
                        {(pergunta.opcoes ?? []).map((opcao, opcaoIndex) => (
                            <label key={opcaoIndex} className="flex items-center gap-2 text-sm text-foreground">
                                <input
                                    type="radio"
                                    name={`alternativa-${bloco.id}-${perguntaIndex}`}
                                    value={opcaoIndex}
                                    checked={String(respostas[perguntaIndex]?.opcao_selecionada_index ?? '') === String(opcaoIndex)}
                                    onChange={(event) => updateResposta(perguntaIndex, event.target.value)}
                                />
                                <span>{opcao}</span>
                            </label>
                        ))}
                        {errors[`respostas.${bloco.id}.respostas.${perguntaIndex}.opcao_selecionada_index`] && (
                            <p className="text-sm text-destructive">
                                {errors[`respostas.${bloco.id}.respostas.${perguntaIndex}.opcao_selecionada_index`]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    if (bloco.tipo === 'complete') {
        const respostas = resposta.respostas ?? defaultResposta(bloco).respostas;

        const updateResposta = (index, value) => {
            onChange({
                respostas: respostas.map((item, currentIndex) => (
                    currentIndex === index ? { ...item, resposta: value } : item
                )),
            });
        };

        return (
            <ol className="list-decimal space-y-4 pl-5">
                {(bloco.conteudo?.textos ?? []).map((texto, index) => {
                    const partes = texto.split('__');
                    const valor = respostas[index]?.resposta ?? '';
                    const erro = errors[`respostas.${bloco.id}.respostas.${index}.resposta`];

                    return (
                        <li key={index} className="leading-loose">
                            <span className="inline-flex flex-wrap items-baseline gap-x-1 text-sm text-foreground">
                                {partes.map((parte, i) => (
                                    <span key={i} className="inline-flex items-baseline gap-x-1">
                                        <span>{parte}</span>
                                        {i < partes.length - 1 && (
                                            <input
                                                type="text"
                                                value={i === 0 ? valor : ''}
                                                onChange={(event) => i === 0 && updateResposta(index, event.target.value)}
                                                placeholder="..."
                                                className="inline-block w-28 border-0 border-b-2 border-primary bg-transparent px-1 text-center text-sm text-foreground focus:outline-none focus:border-ring placeholder:text-muted-foreground/50"
                                            />
                                        )}
                                    </span>
                                ))}
                            </span>
                            {erro && (
                                <p className="mt-1 text-sm text-destructive">{erro}</p>
                            )}
                        </li>
                    );
                })}
            </ol>
        );
    }

    return (
        <div>
            <Label htmlFor={`resposta-${bloco.id}`}>Sua resposta</Label>
            <textarea
                id={`resposta-${bloco.id}`}
                value={resposta.texto ?? ''}
                onChange={(event) => onChange({ texto: event.target.value })}
                className={`${inputClass} min-h-[110px] resize-y`}
                placeholder="Digite sua tradução"
            />
            {errors[`respostas.${bloco.id}.texto`] && (
                <p className="mt-2 text-sm text-destructive">{errors[`respostas.${bloco.id}.texto`]}</p>
            )}
        </div>
    );
}

function RespostaReadOnly({ bloco, resposta }) {
    if (bloco.tipo === 'pergunta_resposta') {
        return (
            <div className="space-y-3">
                {(resposta?.respostas ?? []).map((item, index) => (
                    <div key={index}>
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Resposta {index + 1}
                        </p>
                        <p className="whitespace-pre-wrap text-sm text-foreground">{item.resposta || '—'}</p>
                    </div>
                ))}
            </div>
        );
    }

    if (bloco.tipo === 'alternativa') {
        return (
            <div className="space-y-2">
                {(resposta?.respostas ?? []).map((item, index) => {
                    const pergunta = bloco.conteudo?.perguntas?.[index];
                    const opcao = pergunta?.opcoes?.[item.opcao_selecionada_index];

                    return (
                        <div key={index}>
                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                Seleção {index + 1}
                            </p>
                            <p className="text-sm text-foreground">{opcao ?? '—'}</p>
                        </div>
                    );
                })}
            </div>
        );
    }

    if (bloco.tipo === 'complete') {
        return (
            <ol className="list-decimal space-y-3 pl-5">
                {(bloco.conteudo?.textos ?? []).map((texto, index) => {
                    const item = resposta?.respostas?.[index];
                    const partes = texto.split('__');
                    const valor = item?.resposta || null;

                    return (
                        <li key={index} className="leading-loose">
                            <span className="inline-flex flex-wrap items-baseline gap-x-1 text-sm text-foreground">
                                {partes.map((parte, i) => (
                                    <span key={i} className="inline-flex items-baseline gap-x-1">
                                        <span>{parte}</span>
                                        {i < partes.length - 1 && (
                                            <span className="inline-block min-w-[64px] border-b-2 border-foreground/50 px-1 text-center text-sm font-semibold text-foreground">
                                                {i === 0 ? (valor ?? '—') : '—'}
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

    return (
        <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Sua resposta</p>
            <p className="whitespace-pre-wrap text-sm text-foreground">{resposta?.texto || '—'}</p>
        </div>
    );
}
