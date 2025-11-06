/** @jsxImportSource react */
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import HubLayout from '@/Layouts/HubLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useMemo, useState } from 'react';

const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring";

const formatDate = (value) => {
    if (!value) return '—';

    try {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '—';
        return date.toLocaleDateString();
    } catch (error) {
        return '—';
    }
};

export default function ShowAtividade({ atividade, estatisticas, atividadeAluno, respostasAluno }) {
    const { props } = usePage();
    const userType = props.user?.type || props.auth?.user?.user_type?.name;
    const canManageBase = ['professor', 'admin', 'root'].includes(userType);
    const turmaStatus = atividade?.turma?.status;
    const canManage = canManageBase && turmaStatus === 'em andamento';
    const flash = props.flash || {};

    const questoes = useMemo(() => atividade?.questoes ?? [], [atividade?.questoes]);

    const [editingQuestaoId, setEditingQuestaoId] = useState(null);
    const questaoForm = useForm({
        enunciado: '',
        valor: '',
        status: 'ativa',
        resposta_esperada: '',
    });

    const startEditingQuestao = (questao) => {
        setEditingQuestaoId(questao.id);
        questaoForm.setData((data) => ({
            ...data,
            enunciado: questao.enunciado ?? '',
            valor: questao.valor ?? '',
            status: questao.status ?? 'ativa',
            resposta_esperada: questao.resposta_esperada ?? '',
        }));
        questaoForm.clearErrors();
    };

    const cancelEditingQuestao = () => {
        setEditingQuestaoId(null);
        questaoForm.reset();
        questaoForm.clearErrors();
    };

    const handleUpdateQuestao = (event) => {
        event.preventDefault();
        if (!editingQuestaoId) return;

        questaoForm.put(`/hub/atividades/${atividade.id}/questoes/${editingQuestaoId}`, {
            preserveScroll: true,
            onSuccess: () => {
                cancelEditingQuestao();
            },
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
                    <p className="mt-2 text-sm text-muted-foreground">
                        Verifique se você possui acesso e tente novamente.
                    </p>
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
            <Head title={`Atividade: ${atividade.titulo}`} />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{atividade.titulo}</h1>
                        <p className="text-muted-foreground text-sm">
                            {atividade.turma?.turma?.nome ?? 'Turma não informada'}
                        </p>
                        {turmaStatus && turmaStatus !== 'em andamento' && (
                            <p className="text-xs text-orange-600">
                                Esta turma está {turmaStatus}. Atividades e questões permanecem somente para consulta.
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link href="/hub/atividades">
                            <Button variant="outline" type="button">
                                Voltar
                            </Button>
                        </Link>
                        {canManage && (
                            <Link href={`/hub/atividades/${atividade.id}/edit`}>
                                <Button type="button">
                                    Editar atividade
                                </Button>
                            </Link>
                        )}
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

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações Gerais</CardTitle>
                            <CardDescription>Dados principais da atividade</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div>
                                <span className="text-muted-foreground">Tipo</span>
                                <p className="font-medium text-foreground">
                                    {atividade.tipo?.nome ?? 'Não definido'}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Professor Responsável</span>
                                <p className="font-medium text-foreground">
                                    {atividade.turma?.professor?.name ?? 'Não informado'}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Data de Entrega</span>
                                <p className="font-medium text-foreground">
                                    {formatDate(atividade.data_entrega)}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Nota máxima</span>
                                <p className="font-medium text-foreground">
                                    {atividade.nota_max ?? '—'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Descrição</CardTitle>
                            <CardDescription>Orientações para os alunos</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {atividade.descricao ? (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                                    {atividade.descricao}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Nenhuma descrição fornecida.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {canManage && estatisticas && (
                    <div className="grid gap-4 md:grid-cols-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Total de alunos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-foreground">
                                    {estatisticas.total_alunos ?? 0}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Enviaram</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-foreground">
                                    {estatisticas.enviados ?? 0}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Corrigidos</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-foreground">
                                    {estatisticas.corrigidos ?? 0}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Pendentes</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-3xl font-bold text-foreground">
                                    {estatisticas.pendentes ?? 0}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Questões da atividade</CardTitle>
                            <CardDescription>
                                {questoes.length > 0
                                    ? 'Gerencie o conteúdo que os alunos deverão responder'
                                    : 'Nenhuma questão cadastrada ainda'}
                            </CardDescription>
                            {canManage && (
                                <div className="mt-4 flex justify-end">
                                    <Link href={`/hub/atividades/${atividade.id}/questoes/create`}>
                                        <Button type="button">Adicionar questão</Button>
                                    </Link>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {questoes.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    Assim que você adicionar questões, elas aparecerão aqui.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {questoes.map((questao, index) => (
                                        <div
                                            key={questao.id}
                                            className="rounded-lg border border-border p-4"
                                        >
                                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <Badge variant="secondary">
                                                            Questão {index + 1}
                                                        </Badge>
                                                        <Badge variant={questao.status === 'anulada' ? 'destructive' : 'default'}>
                                                            {questao.status ?? 'ativa'}
                                                        </Badge>
                                                        <Badge variant="outline">
                                                            Valor: {questao.valor ?? 0}
                                                        </Badge>
                                                    </div>
                                                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                                                        {questao.enunciado}
                                                    </p>
                                                    {questao.resposta_esperada && (
                                                        <div className="rounded-md bg-muted/60 p-3">
                                                            <p className="text-xs uppercase tracking-wide text-muted-foreground">
                                                                Resposta esperada
                                                            </p>
                                                            <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                                                                {questao.resposta_esperada}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                {canManage && editingQuestaoId !== questao.id && (
                                                    <div className="flex gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => startEditingQuestao(questao)}
                                                        >
                                                            Editar
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                            {canManage && editingQuestaoId === questao.id && (
                                                <form
                                                    onSubmit={handleUpdateQuestao}
                                                    className="mt-4 space-y-4 rounded-md border border-dashed border-border p-4"
                                                >
                                                    <div>
                                                        <Label htmlFor={`enunciado-${questao.id}`}>Enunciado</Label>
                                                        <textarea
                                                            id={`enunciado-${questao.id}`}
                                                            value={questaoForm.data.enunciado}
                                                            onChange={(event) =>
                                                                questaoForm.setData('enunciado', event.target.value)
                                                            }
                                                            placeholder="Atualize o enunciado da questão"
                                                            className={`${inputClass} min-h-[120px] resize-y`}
                                                        />
                                                        {questaoForm.errors.enunciado && (
                                                            <p className="mt-2 text-sm text-destructive">
                                                                {questaoForm.errors.enunciado}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="grid gap-4 md:grid-cols-2">
                                                        <div>
                                                            <Label htmlFor={`valor-${questao.id}`}>Valor da questão</Label>
                                                            <Input
                                                                id={`valor-${questao.id}`}
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={questaoForm.data.valor}
                                                                onChange={(event) =>
                                                                    questaoForm.setData('valor', event.target.value)
                                                                }
                                                                placeholder="Ex: 2"
                                                            />
                                                            {questaoForm.errors.valor && (
                                                                <p className="mt-2 text-sm text-destructive">
                                                                    {questaoForm.errors.valor}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <Label htmlFor={`status-${questao.id}`}>Status</Label>
                                                            <select
                                                                id={`status-${questao.id}`}
                                                                value={questaoForm.data.status}
                                                                onChange={(event) =>
                                                                    questaoForm.setData('status', event.target.value)
                                                                }
                                                                className={inputClass}
                                                            >
                                                                <option value="ativa">Ativa</option>
                                                                <option value="anulada">Anulada</option>
                                                            </select>
                                                            {questaoForm.errors.status && (
                                                                <p className="mt-2 text-sm text-destructive">
                                                                    {questaoForm.errors.status}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Label htmlFor={`resposta_esperada-${questao.id}`}>Resposta esperada (opcional)</Label>
                                                        <textarea
                                                            id={`resposta_esperada-${questao.id}`}
                                                            value={questaoForm.data.resposta_esperada}
                                                            onChange={(event) =>
                                                                questaoForm.setData('resposta_esperada', event.target.value)
                                                            }
                                                            placeholder="Atualize a resposta de referência desta questão"
                                                            className={`${inputClass} min-h-[120px] resize-y`}
                                                        />
                                                        {questaoForm.errors.resposta_esperada && (
                                                            <p className="mt-2 text-sm text-destructive">
                                                                {questaoForm.errors.resposta_esperada}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            onClick={cancelEditingQuestao}
                                                            disabled={questaoForm.processing}
                                                        >
                                                            Cancelar
                                                        </Button>
                                                        <Button type="submit" disabled={questaoForm.processing}>
                                                            {questaoForm.processing ? 'Salvando...' : 'Salvar alterações'}
                                                        </Button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </HubLayout>
    );
}
