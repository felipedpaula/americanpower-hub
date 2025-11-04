/** @jsxImportSource react */
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CMSLayout from '@/Layouts/CMSLayout';

export default function Edit({ turmaCriada, turmas, professores, alunos }) {
    const { data, setData, put, processing, errors } = useForm({
        turma_id: turmaCriada.turma_id,
        professor_id: turmaCriada.professor_id,
        alunos: turmaCriada.alunos || [],
        status: turmaCriada.status,
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

    return (
        <CMSLayout>
            <Head title="Editar Turma - CMS" />

            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Editar Turma</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Atualize as informações da turma
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
                                        <Select
                                            id="turma_id"
                                            value={data.turma_id}
                                            onChange={(e) => setData('turma_id', e.target.value)}
                                            className={errors.turma_id ? 'border-red-500' : ''}
                                        >
                                            <option value="">Selecione...</option>
                                            {turmas.map((turma) => (
                                                <option key={turma.id} value={turma.id}>
                                                    {turma.nome}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.turma_id && (
                                            <p className="text-sm text-red-600">{errors.turma_id}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="professor_id">
                                            Professor <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            id="professor_id"
                                            value={data.professor_id}
                                            onChange={(e) => setData('professor_id', e.target.value)}
                                            className={errors.professor_id ? 'border-red-500' : ''}
                                        >
                                            <option value="">Selecione...</option>
                                            {professores.map((professor) => (
                                                <option key={professor.id} value={professor.id}>
                                                    {professor.name}
                                                </option>
                                            ))}
                                        </Select>
                                        {errors.professor_id && (
                                            <p className="text-sm text-red-600">{errors.professor_id}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        Status <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        id="status"
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className={errors.status ? 'border-red-500' : ''}
                                    >
                                        <option value="em andamento">✅ Em andamento</option>
                                        <option value="bloqueada">⚠️ Bloqueada</option>
                                        <option value="encerrada">🔒 Encerrada</option>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-red-600">{errors.status}</p>
                                    )}
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
