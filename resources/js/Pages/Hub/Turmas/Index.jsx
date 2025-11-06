/** @jsxImportSource react */
import { Head, Link } from '@inertiajs/react';
import HubLayout from '@/Layouts/HubLayout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const weekdayLabels = {
    domingo: 'Domingo',
    segunda: 'Segunda',
    terca: 'Terça',
    quarta: 'Quarta',
    quinta: 'Quinta',
    sexta: 'Sexta',
    sabado: 'Sábado',
};

const formatDias = (dias = []) => {
    if (!Array.isArray(dias) || dias.length === 0) {
        return 'Dias não definidos';
    }

    const ordered = Object.keys(weekdayLabels).filter((dia) => dias.includes(dia));
    return ordered.length > 0
        ? ordered.map((dia) => weekdayLabels[dia]).join(', ')
        : 'Dias não definidos';
};

const formatHorario = (inicio, fim) => {
    if (!inicio && !fim) return 'Horário não definido';
    if (inicio && fim) return `${inicio} às ${fim}`;
    return inicio ? `Início às ${inicio}` : `Até ${fim}`;
};

export default function TurmasIndex({ turmas = [], userType }) {
    return (
        <HubLayout>
            <Head title="Minhas Turmas" />

            <div className="space-y-6">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Minhas Turmas</h1>
                        <p className="text-sm text-muted-foreground">
                            Consulte os detalhes das turmas disponíveis para o seu usuário.
                        </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {userType === 'professor'
                            ? 'Você pode criar novas atividades apenas para turmas em andamento.'
                            : 'Fique de olho nos horários e nas atividades publicadas.'}
                    </div>
                </div>

                {turmas.length === 0 ? (
                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle>Nenhuma turma disponível</CardTitle>
                            <CardDescription>
                                Assim que novas turmas forem atribuídas ao seu usuário, elas aparecerão aqui.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Caso acredite que há algum problema no acesso, entre em contato com um administrador.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {turmas.map((turma) => (
                            <Link
                                key={turma.id}
                                href={`/hub/turmas/${turma.id}`}
                                className="block transition-smooth hover:translate-x-1"
                            >
                                <Card className="h-full">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between gap-3">
                                            <CardTitle className="text-xl text-foreground">
                                                {turma.turma?.nome ?? `Turma #${turma.id}`}
                                            </CardTitle>
                                            <Badge
                                                variant={
                                                    turma.status === 'em andamento'
                                                        ? 'default'
                                                        : turma.status === 'bloqueada'
                                                            ? 'destructive'
                                                            : 'secondary'
                                                }
                                            >
                                                {turma.status}
                                            </Badge>
                                        </div>
                                        <CardDescription className="text-sm">
                                            Professor:{' '}
                                            <span className="text-foreground font-medium">
                                                {turma.professor?.name ?? 'Não definido'}
                                            </span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-3 md:grid-cols-3 text-sm text-muted-foreground">
                                        <div>
                                            <p className="font-medium text-foreground">Agenda</p>
                                            <p>{formatDias(turma.dias_semana)}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Horário</p>
                                            <p>{formatHorario(turma.inicio, turma.fim)}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">Total de alunos</p>
                                            <p>{turma.total_alunos ?? 0}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </HubLayout>
    );
}
