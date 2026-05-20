/** @jsxImportSource react */
import { Head, Link, useForm } from '@inertiajs/react';
import HubLayout from '@/Layouts/HubLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-60";

const tipos = [
    { value: 'traducao', label: 'Texto para traduzir' },
    { value: 'complete', label: 'Completar lacunas' },
    { value: 'pergunta_resposta', label: 'Perguntas abertas' },
    { value: 'alternativa', label: 'Alternativas' },
];

const defaultContent = (tipo) => {
    if (tipo === 'pergunta_resposta') {
        return { perguntas: [''] };
    }

    if (tipo === 'alternativa') {
        return {
            perguntas: [
                {
                    pergunta: '',
                    opcoes: ['', ''],
                },
            ],
        };
    }

    return { texto: '' };
};

const createBlock = (ordem) => ({
    tipo: 'traducao',
    ordem,
    titulo: '',
    conteudo: defaultContent('traducao'),
});

const normalizeBlocks = (blocks = []) => {
    if (!Array.isArray(blocks) || blocks.length === 0) {
        return [createBlock(1)];
    }

    return blocks.map((block, index) => ({
        tipo: block.tipo ?? 'traducao',
        ordem: index + 1,
        titulo: block.titulo ?? '',
        conteudo: normalizeContent(block.tipo ?? 'traducao', block.conteudo ?? {}),
    }));
};

const normalizeContent = (tipo, content) => {
    if (tipo === 'pergunta_resposta') {
        const perguntas = Array.isArray(content.perguntas) && content.perguntas.length > 0
            ? content.perguntas
            : [''];

        return { perguntas };
    }

    if (tipo === 'alternativa') {
        const perguntas = Array.isArray(content.perguntas) && content.perguntas.length > 0
            ? content.perguntas.map((pergunta) => ({
                pergunta: pergunta.pergunta ?? '',
                opcoes: Array.isArray(pergunta.opcoes) && pergunta.opcoes.length > 0
                    ? pergunta.opcoes
                    : ['', ''],
            }))
            : [{ pergunta: '', opcoes: ['', ''] }];

        return { perguntas };
    }

    return { texto: content.texto ?? '' };
};

const formatDateTimeLocal = (value) => {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';

    const pad = (part) => String(part).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatTurmaLabel = (turmaCriada) => {
    const nomeTurma = turmaCriada.turma?.nome ?? `Turma #${turmaCriada.id}`;
    const professor = turmaCriada.professor?.name ? ` | ${turmaCriada.professor.name}` : '';

    if (turmaCriada.status === 'em andamento') {
        return `${nomeTurma}${professor}`;
    }

    return `${nomeTurma}${professor} (${turmaCriada.status})`;
};

export default function AtividadeForm({
    mode = 'create',
    turmas = [],
    atividade = null,
    canEditStructure = true,
}) {
    const isEdit = mode === 'edit';
    const title = isEdit ? 'Editar atividade' : 'Nova atividade';
    const description = isEdit
        ? 'Atualize os dados da atividade e seus blocos enquanto não houver entregas.'
        : 'Crie uma atividade com blocos ordenados para todos os alunos da turma.';

    const { data, setData, post, put, processing, errors } = useForm({
        turma_criada_id: atividade?.turma_criada_id ?? '',
        titulo: atividade?.titulo ?? '',
        descricao: atividade?.descricao ?? '',
        instrucoes: atividade?.instrucoes ?? '',
        nota_max: atividade?.nota_max ?? '',
        data_entrega: formatDateTimeLocal(atividade?.data_entrega),
        blocos: normalizeBlocks(atividade?.blocos),
    });

    const submit = (event) => {
        event.preventDefault();

        if (isEdit) {
            put(`/hub/atividades/${atividade.id}`);
            return;
        }

        post('/hub/atividades');
    };

    const setBlock = (index, changes) => {
        const next = data.blocos.map((block, blockIndex) => {
            if (blockIndex !== index) return block;
            return { ...block, ...changes };
        });
        setData('blocos', normalizeBlocks(next));
    };

    const updateBlockType = (index, tipo) => {
        setBlock(index, {
            tipo,
            conteudo: defaultContent(tipo),
        });
    };

    const addBlock = () => {
        setData('blocos', [...data.blocos, createBlock(data.blocos.length + 1)]);
    };

    const removeBlock = (index) => {
        if (data.blocos.length === 1) return;
        setData('blocos', normalizeBlocks(data.blocos.filter((_, blockIndex) => blockIndex !== index)));
    };

    const moveBlock = (index, direction) => {
        const target = index + direction;
        if (target < 0 || target >= data.blocos.length) return;

        const next = [...data.blocos];
        [next[index], next[target]] = [next[target], next[index]];
        setData('blocos', normalizeBlocks(next));
    };

    const updateContent = (index, conteudo) => {
        setBlock(index, { conteudo });
    };

    return (
        <HubLayout>
            <Head title={title} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Link href={isEdit ? `/hub/atividades/${atividade.id}` : '/hub/atividades'}>
                            <Button variant="outline" type="button">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="button" onClick={submit} disabled={processing}>
                            {processing ? 'Salvando...' : 'Salvar atividade'}
                        </Button>
                    </div>
                </div>

                {!canEditStructure && (
                    <div className="rounded-md border border-orange-500/40 bg-orange-500/10 p-4 text-sm text-orange-700">
                        Já existe entrega nesta atividade. A turma e os blocos ficam bloqueados; apenas dados gerais podem ser editados.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Dados gerais</CardTitle>
                            <CardDescription>Defina turma, prazo, instruções e nota máxima.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="turma_criada_id">Turma criada</Label>
                                    <select
                                        id="turma_criada_id"
                                        value={data.turma_criada_id}
                                        onChange={(event) => setData('turma_criada_id', event.target.value)}
                                        className={inputClass}
                                        disabled={!canEditStructure}
                                    >
                                        <option value="">Selecione a turma</option>
                                        {turmas.map((turmaCriada) => (
                                            <option
                                                key={turmaCriada.id}
                                                value={turmaCriada.id}
                                                disabled={turmaCriada.status !== 'em andamento'}
                                            >
                                                {formatTurmaLabel(turmaCriada)}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.turma_criada_id && (
                                        <p className="mt-2 text-sm text-destructive">{errors.turma_criada_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="titulo">Título</Label>
                                    <Input
                                        id="titulo"
                                        value={data.titulo}
                                        onChange={(event) => setData('titulo', event.target.value)}
                                        placeholder="Ex: Unit 3 - Practice"
                                    />
                                    {errors.titulo && (
                                        <p className="mt-2 text-sm text-destructive">{errors.titulo}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <Label htmlFor="nota_max">Nota máxima</Label>
                                    <Input
                                        id="nota_max"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.nota_max}
                                        onChange={(event) => setData('nota_max', event.target.value)}
                                        placeholder="Ex: 10"
                                    />
                                    {errors.nota_max && (
                                        <p className="mt-2 text-sm text-destructive">{errors.nota_max}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="data_entrega">Prazo de entrega</Label>
                                    <Input
                                        id="data_entrega"
                                        type="datetime-local"
                                        value={data.data_entrega}
                                        onChange={(event) => setData('data_entrega', event.target.value)}
                                    />
                                    {errors.data_entrega && (
                                        <p className="mt-2 text-sm text-destructive">{errors.data_entrega}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="descricao">Descrição</Label>
                                <textarea
                                    id="descricao"
                                    value={data.descricao}
                                    onChange={(event) => setData('descricao', event.target.value)}
                                    placeholder="Resumo da atividade"
                                    className={`${inputClass} min-h-[100px] resize-y`}
                                />
                                {errors.descricao && (
                                    <p className="mt-2 text-sm text-destructive">{errors.descricao}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="instrucoes">Instruções para os alunos</Label>
                                <textarea
                                    id="instrucoes"
                                    value={data.instrucoes}
                                    onChange={(event) => setData('instrucoes', event.target.value)}
                                    placeholder="Explique como a atividade deve ser respondida"
                                    className={`${inputClass} min-h-[120px] resize-y`}
                                />
                                {errors.instrucoes && (
                                    <p className="mt-2 text-sm text-destructive">{errors.instrucoes}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Blocos da atividade</CardTitle>
                            <CardDescription>
                                Organize textos, perguntas abertas, lacunas e alternativas na ordem desejada.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {errors.blocos && (
                                <p className="text-sm text-destructive">{errors.blocos}</p>
                            )}

                            {data.blocos.map((block, index) => (
                                <div key={`${block.ordem}-${index}`} className="rounded-lg border border-border p-4">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">Bloco {index + 1}</Badge>
                                            <Badge variant="outline">
                                                {tipos.find((tipo) => tipo.value === block.tipo)?.label}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => moveBlock(index, -1)}
                                                disabled={!canEditStructure || index === 0}
                                            >
                                                Subir
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => moveBlock(index, 1)}
                                                disabled={!canEditStructure || index === data.blocos.length - 1}
                                            >
                                                Descer
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeBlock(index)}
                                                disabled={!canEditStructure || data.blocos.length === 1}
                                            >
                                                Remover
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                                        <div>
                                            <Label htmlFor={`tipo-${index}`}>Tipo</Label>
                                            <select
                                                id={`tipo-${index}`}
                                                value={block.tipo}
                                                onChange={(event) => updateBlockType(index, event.target.value)}
                                                className={inputClass}
                                                disabled={!canEditStructure}
                                            >
                                                {tipos.map((tipo) => (
                                                    <option key={tipo.value} value={tipo.value}>
                                                        {tipo.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors[`blocos.${index}.tipo`] && (
                                                <p className="mt-2 text-sm text-destructive">{errors[`blocos.${index}.tipo`]}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor={`titulo-bloco-${index}`}>Título do bloco (opcional)</Label>
                                            <Input
                                                id={`titulo-bloco-${index}`}
                                                value={block.titulo}
                                                onChange={(event) => setBlock(index, { titulo: event.target.value })}
                                                placeholder="Ex: Translate into English"
                                                disabled={!canEditStructure}
                                            />
                                            {errors[`blocos.${index}.titulo`] && (
                                                <p className="mt-2 text-sm text-destructive">{errors[`blocos.${index}.titulo`]}</p>
                                            )}
                                        </div>
                                    </div>

                                    <BlockContentEditor
                                        block={block}
                                        index={index}
                                        errors={errors}
                                        disabled={!canEditStructure}
                                        onChange={(conteudo) => updateContent(index, conteudo)}
                                    />
                                </div>
                            ))}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={addBlock}
                                disabled={!canEditStructure}
                                className="w-full"
                            >
                                Adicionar bloco
                            </Button>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Link href={isEdit ? `/hub/atividades/${atividade.id}` : '/hub/atividades'}>
                            <Button variant="outline" type="button">
                                Voltar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Salvando...' : 'Salvar atividade'}
                        </Button>
                    </div>
                </form>
            </div>
        </HubLayout>
    );
}

function BlockContentEditor({ block, index, errors, disabled, onChange }) {
    if (block.tipo === 'pergunta_resposta') {
        const perguntas = block.conteudo.perguntas ?? [''];

        const updatePergunta = (perguntaIndex, value) => {
            onChange({
                perguntas: perguntas.map((pergunta, currentIndex) => (
                    currentIndex === perguntaIndex ? value : pergunta
                )),
            });
        };

        const addPergunta = () => onChange({ perguntas: [...perguntas, ''] });
        const removePergunta = (perguntaIndex) => {
            if (perguntas.length === 1) return;
            onChange({ perguntas: perguntas.filter((_, currentIndex) => currentIndex !== perguntaIndex) });
        };

        return (
            <div className="mt-4 space-y-3">
                <Label>Perguntas</Label>
                {perguntas.map((pergunta, perguntaIndex) => (
                    <div key={perguntaIndex} className="flex gap-2">
                        <Input
                            value={pergunta}
                            onChange={(event) => updatePergunta(perguntaIndex, event.target.value)}
                            placeholder={`Pergunta ${perguntaIndex + 1}`}
                            disabled={disabled}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => removePergunta(perguntaIndex)}
                            disabled={disabled || perguntas.length === 1}
                        >
                            Remover
                        </Button>
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addPergunta} disabled={disabled}>
                    Adicionar pergunta
                </Button>
                {errors[`blocos.${index}.conteudo.perguntas`] && (
                    <p className="text-sm text-destructive">{errors[`blocos.${index}.conteudo.perguntas`]}</p>
                )}
            </div>
        );
    }

    if (block.tipo === 'alternativa') {
        const perguntas = block.conteudo.perguntas ?? [{ pergunta: '', opcoes: ['', ''] }];

        const updatePergunta = (perguntaIndex, changes) => {
            onChange({
                perguntas: perguntas.map((pergunta, currentIndex) => (
                    currentIndex === perguntaIndex ? { ...pergunta, ...changes } : pergunta
                )),
            });
        };

        const updateOpcao = (perguntaIndex, opcaoIndex, value) => {
            const pergunta = perguntas[perguntaIndex];
            updatePergunta(perguntaIndex, {
                opcoes: pergunta.opcoes.map((opcao, currentIndex) => (
                    currentIndex === opcaoIndex ? value : opcao
                )),
            });
        };

        const addPergunta = () => {
            onChange({
                perguntas: [...perguntas, { pergunta: '', opcoes: ['', ''] }],
            });
        };

        const removePergunta = (perguntaIndex) => {
            if (perguntas.length === 1) return;
            onChange({ perguntas: perguntas.filter((_, currentIndex) => currentIndex !== perguntaIndex) });
        };

        const addOpcao = (perguntaIndex) => {
            const pergunta = perguntas[perguntaIndex];
            updatePergunta(perguntaIndex, { opcoes: [...pergunta.opcoes, ''] });
        };

        const removeOpcao = (perguntaIndex, opcaoIndex) => {
            const pergunta = perguntas[perguntaIndex];
            if (pergunta.opcoes.length === 2) return;
            updatePergunta(perguntaIndex, {
                opcoes: pergunta.opcoes.filter((_, currentIndex) => currentIndex !== opcaoIndex),
            });
        };

        return (
            <div className="mt-4 space-y-4">
                <Label>Perguntas de alternativa</Label>
                {perguntas.map((pergunta, perguntaIndex) => (
                    <div key={perguntaIndex} className="rounded-md border border-border p-3">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                            <Input
                                value={pergunta.pergunta}
                                onChange={(event) => updatePergunta(perguntaIndex, { pergunta: event.target.value })}
                                placeholder={`Pergunta ${perguntaIndex + 1}`}
                                disabled={disabled}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => removePergunta(perguntaIndex)}
                                disabled={disabled || perguntas.length === 1}
                            >
                                Remover pergunta
                            </Button>
                        </div>

                        <div className="mt-3 space-y-2">
                            {(pergunta.opcoes ?? ['', '']).map((opcao, opcaoIndex) => (
                                <div key={opcaoIndex} className="flex gap-2">
                                    <Input
                                        value={opcao}
                                        onChange={(event) => updateOpcao(perguntaIndex, opcaoIndex, event.target.value)}
                                        placeholder={`Opção ${opcaoIndex + 1}`}
                                        disabled={disabled}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => removeOpcao(perguntaIndex, opcaoIndex)}
                                        disabled={disabled || pergunta.opcoes.length === 2}
                                    >
                                        Remover
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => addOpcao(perguntaIndex)}
                                disabled={disabled}
                            >
                                Adicionar opção
                            </Button>
                        </div>
                        {errors[`blocos.${index}.conteudo.perguntas.${perguntaIndex}`] && (
                            <p className="mt-2 text-sm text-destructive">{errors[`blocos.${index}.conteudo.perguntas.${perguntaIndex}`]}</p>
                        )}
                    </div>
                ))}
                <Button type="button" variant="outline" onClick={addPergunta} disabled={disabled}>
                    Adicionar pergunta de alternativa
                </Button>
                {errors[`blocos.${index}.conteudo.perguntas`] && (
                    <p className="text-sm text-destructive">{errors[`blocos.${index}.conteudo.perguntas`]}</p>
                )}
            </div>
        );
    }

    return (
        <div className="mt-4">
            <Label htmlFor={`texto-${index}`}>
                {block.tipo === 'complete' ? 'Texto com lacunas' : 'Texto para tradução'}
            </Label>
            <textarea
                id={`texto-${index}`}
                value={block.conteudo.texto ?? ''}
                onChange={(event) => onChange({ texto: event.target.value })}
                placeholder={block.tipo === 'complete' ? 'Ex: I ____ English every day.' : 'Ex: Eu gosto de estudar inglês.'}
                className={`${inputClass} min-h-[120px] resize-y`}
                disabled={disabled}
            />
            {errors[`blocos.${index}.conteudo.texto`] && (
                <p className="mt-2 text-sm text-destructive">{errors[`blocos.${index}.conteudo.texto`]}</p>
            )}
        </div>
    );
}
