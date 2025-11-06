/** @jsxImportSource react */
import { Head, Link, useForm } from '@inertiajs/react';
import HubLayout from '@/Layouts/HubLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const inputClass = "mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring";

export default function CreateAtividade({ turmas = [], tipos = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        turma_id: '',
        tipo_id: '',
        titulo: '',
        descricao: '',
        nota_max: '',
        data_entrega: '',
    });
    const formatTurmaLabel = (turmaCriada) => {
        const nomeTurma = turmaCriada.turma?.nome ?? `Turma #${turmaCriada.id}`;
        if (turmaCriada.status === 'em andamento') {
            return nomeTurma;
        }
        return `${nomeTurma} (${turmaCriada.status})`;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        post('/hub/atividades');
    };

    return (
        <HubLayout>
            <Head title="Nova Atividade" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Nova Atividade</h1>
                        <p className="text-muted-foreground text-sm">
                            Preencha os dados abaixo para disponibilizar uma nova atividade aos alunos.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/hub/atividades">
                            <Button variant="outline" type="button">
                                Cancelar
                            </Button>
                        </Link>
                        <Button type="button" onClick={handleSubmit} disabled={processing}>
                            Salvar atividade
                        </Button>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid gap-6 rounded-lg border border-border bg-card p-6 shadow-sm"
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="turma_id">Turma</Label>
                            <select
                                id="turma_id"
                                value={data.turma_id}
                                onChange={(event) => setData('turma_id', event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Selecione a turma</option>
                                {turmas.map((turmaCriada) => (
                                    <option
                                        key={turmaCriada.id}
                                        value={turmaCriada.id}
                                        disabled={turmaCriada.status !== 'em andamento'}
                                        title={
                                            turmaCriada.status !== 'em andamento'
                                                ? 'Turmas bloqueadas ou encerradas não permitem novas atividades.'
                                                : undefined
                                        }
                                    >
                                        {formatTurmaLabel(turmaCriada)}
                                    </option>
                                ))}
                            </select>
                            {errors.turma_id && (
                                <p className="mt-2 text-sm text-destructive">{errors.turma_id}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="tipo_id">Tipo de atividade</Label>
                            <select
                                id="tipo_id"
                                value={data.tipo_id}
                                onChange={(event) => setData('tipo_id', event.target.value)}
                                className={inputClass}
                            >
                                <option value="">Selecione o tipo</option>
                                {tipos.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nome}
                                    </option>
                                ))}
                            </select>
                            {errors.tipo_id && (
                                <p className="mt-2 text-sm text-destructive">{errors.tipo_id}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <Label htmlFor="titulo">Título</Label>
                            <Input
                                id="titulo"
                                value={data.titulo}
                                onChange={(event) => setData('titulo', event.target.value)}
                                placeholder="Informe um título descritivo"
                            />
                            {errors.titulo && (
                                <p className="mt-2 text-sm text-destructive">{errors.titulo}</p>
                            )}
                        </div>

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
                    </div>

                    <div>
                        <Label htmlFor="data_entrega">Data de entrega (opcional)</Label>
                        <Input
                            id="data_entrega"
                            type="date"
                            value={data.data_entrega ?? ''}
                            onChange={(event) => setData('data_entrega', event.target.value)}
                        />
                        {errors.data_entrega && (
                            <p className="mt-2 text-sm text-destructive">{errors.data_entrega}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <textarea
                            id="descricao"
                            value={data.descricao}
                            onChange={(event) => setData('descricao', event.target.value)}
                            placeholder="Detalhe as orientações da atividade"
                            className={`${inputClass} min-h-[120px] resize-y`}
                        />
                        {errors.descricao && (
                            <p className="mt-2 text-sm text-destructive">{errors.descricao}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Link href="/hub/atividades">
                            <Button variant="outline" type="button">
                                Voltar
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Salvando...' : 'Criar atividade'}
                        </Button>
                    </div>
                </form>
            </div>
        </HubLayout>
    );
}
