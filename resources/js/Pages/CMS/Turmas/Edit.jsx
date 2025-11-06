/** @jsxImportSource react */
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CMSLayout from '@/Layouts/CMSLayout';

const diasSemanaOptions = [
    { value: 'domingo', label: 'Dom' },
    { value: 'segunda', label: 'Seg' },
    { value: 'terca', label: 'Ter' },
    { value: 'quarta', label: 'Qua' },
    { value: 'quinta', label: 'Qui' },
    { value: 'sexta', label: 'Sex' },
    { value: 'sabado', label: 'Sáb' },
];

export default function Edit({ turmaCriada, turmas, professores, alunos, totalAlunosAlocados }) {
    const { data, setData, put, processing, errors } = useForm({
        turma_id: turmaCriada.turma_id,
        professor_id: turmaCriada.professor_id,
        alunos: turmaCriada.alunos || [],
        status: turmaCriada.status,
        dias_semana: turmaCriada.dias_semana || [],
        inicio: turmaCriada.inicio || '',
        fim: turmaCriada.fim || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/cms/turmas/${turmaCriada.id}`);
    };

    const toggleAluno = (alunoId) => {
        if (data.alunos.includes(alunoId)) {
            setData('alunos', data.alunos.filter(id => id !== alunoId));
        } else {
            setData('alunos', [...data.alunos, alunoId]);
        }
    };

    const toggleDiaSemana = (dia) => {
        if (data.dias_semana.includes(dia)) {
            setData('dias_semana', data.dias_semana.filter((value) => value !== dia));
        } else {
            setData('dias_semana', [...data.dias_semana, dia]);
        }
    };

    const orderedDias = diasSemanaOptions
        .filter((dia) => data.dias_semana.includes(dia.value))
        .map((dia) => dia.label);
    const diasSelecionadosTexto = orderedDias.length > 0 ? orderedDias.join(', ') : '-';
    const horarioTexto = data.inicio && data.fim
        ? `${data.inicio} às ${data.fim}`
        : data.inicio
            ? `Início ${data.inicio}`
            : data.fim
                ? `Até ${data.fim}`
                : '-';

    return (
        <CMSLayout>
            <Head title="Editar Turma - CMS" />

            <div className="space-y-6 animate-fadeIn">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground dark:text-foreground">Editar Turma</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Altere os dados da turma
                        </p>
                    </div>
                    <Link href="/cms/turmas">
                        <Button variant="outline">
                            ← Voltar
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informações Básicas</CardTitle>
                                <CardDescription>
                                    Defina a turma e o professor responsável
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="turma_id">
                                            Turma <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="turma_id"
                                            value={data.turma_id}
                                            onChange={(e) => setData('turma_id', e.target.value)}
                                            className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.turma_id ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Selecione...</option>
                                            {turmas.map((turma) => (
                                                <option key={turma.id} value={turma.id}>
                                                    {turma.nome}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.turma_id && (
                                            <p className="text-sm text-red-600">{errors.turma_id}</p>
                                        )}
                                    </div>

                                                                        <div className="space-y-2">
                                        <Label htmlFor="professor_id">
                                            Professor <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="professor_id"
                                            value={data.professor_id}
                                            onChange={(e) => setData('professor_id', e.target.value)}
                                            className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.professor_id ? 'border-red-500' : ''}`}
                                        >
                                            <option value="">Selecione...</option>
                                            {professores.map((prof) => (
                                                <option key={prof.id} value={prof.id}>
                                                    {prof.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.professor_id && (
                                            <p className="text-sm text-red-600">{errors.professor_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.status ? 'border-red-500' : ''}`}
                                    >
                                        <option value="em andamento">✅ Em andamento</option>
                                        <option value="bloqueada">⚠️ Bloqueada</option>
                                        <option value="encerrada">🔒 Encerrada</option>
                                    </select>
                                    {errors.status && (
                                        <p className="text-sm text-red-600">{errors.status}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Agenda da Turma</CardTitle>
                                <CardDescription>Configure os dias e horários das aulas</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label>Dias da semana</Label>
                                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {diasSemanaOptions.map((dia) => (
                                            <button
                                                type="button"
                                                key={dia.value}
                                                onClick={() => toggleDiaSemana(dia.value)}
                                                className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                                                    data.dias_semana.includes(dia.value)
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-border hover:bg-muted'
                                                }`}
                                            >
                                                {dia.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.dias_semana && (
                                        <p className="text-sm text-red-600 mt-2">{errors.dias_semana}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="inicio">Horário de início</Label>
                                        <input
                                            id="inicio"
                                            type="time"
                                            value={data.inicio}
                                            onChange={(e) => setData('inicio', e.target.value)}
                                            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors.inicio ? 'border-red-500' : ''}`}
                                        />
                                        {errors.inicio && (
                                            <p className="text-sm text-red-600">{errors.inicio}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fim">Horário de término</Label>
                                        <input
                                            id="fim"
                                            type="time"
                                            value={data.fim}
                                            onChange={(e) => setData('fim', e.target.value)}
                                            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors.fim ? 'border-red-500' : ''}`}
                                        />
                                        {errors.fim && (
                                            <p className="text-sm text-red-600">{errors.fim}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Alunos da Turma</CardTitle>
                                <CardDescription>
                                    Selecione os alunos que farão parte desta turma
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {alunos.length === 0 ? (
                                    <div className="text-center py-8">
                                        <span className="text-4xl block mb-2">👨‍🎓</span>
                                        <p className="text-sm text-muted-foreground">
                                            Nenhum aluno disponível
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        {totalAlunosAlocados > 0 && (
                                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                                                ℹ️ {totalAlunosAlocados} aluno(s) já alocado(s) em outras turmas
                                            </div>
                                        )}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                                            {alunos.map((aluno) => (
                                                <label
                                                    key={aluno.id}
                                                    className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                                                        data.alunos.includes(aluno.id)
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={data.alunos.includes(aluno.id)}
                                                        onChange={() => toggleAluno(aluno.id)}
                                                        className="rounded border-gray-300"
                                                    />
                                                    <div className="flex items-center space-x-2 flex-1">
                                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                                                            {aluno.name.charAt(0)}
                                                        </div>
                                                        <span className="text-sm font-medium">{aluno.name}</span>
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {errors.alunos && (
                                    <p className="text-sm text-red-600 mt-2">{errors.alunos}</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle>Resumo</CardTitle>
                                <CardDescription>
                                    Informações da turma
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Turma:</span>
                                        <span className="font-medium">
                                            {data.turma_id
                                                ? turmas.find(t => t.id == data.turma_id)?.nome
                                                : '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Professor:</span>
                                        <span className="font-medium">
                                            {data.professor_id
                                                ? professores.find(p => p.id == data.professor_id)?.name
                                                : '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Alunos:</span>
                                        <span className="font-medium">{data.alunos.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className="font-medium">{data.status}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Dias:</span>
                                        <span className="font-medium text-right">{diasSelecionadosTexto}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Horário:</span>
                                        <span className="font-medium">{horarioTexto}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t space-y-2">
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing ? '⏳ Salvando...' : '💾 Salvar Alterações'}
                                    </Button>
                                    <Link href="/cms/turmas" className="block">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Cancelar
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </CMSLayout>
    );
}
