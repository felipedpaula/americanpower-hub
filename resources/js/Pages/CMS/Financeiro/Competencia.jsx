/** @jsxImportSource react */
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import CMSLayout from '@/Layouts/CMSLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function Competencia({ aluno, competencia, registro = {}, statusOptions = [] }) {
    const { props } = usePage();

    const form = useForm({
        valor_previsto: registro?.valor_previsto ?? '',
        data_vencimento: registro?.data_vencimento ?? '',
        valor_pago: registro?.valor_pago ?? '',
        data_pagamento: registro?.data_pagamento ?? '',
        metodo: registro?.metodo ?? '',
        status: registro?.status ?? 'aberto',
        observacao: registro?.observacao ?? '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        form.put(`/cms/financeiro/alunos/${aluno.id}/competencias/${competencia.valor}`);
    };

    return (
        <CMSLayout>
            <Head title={`Financeiro - ${aluno?.name} (${competencia?.valor})`} />

            <div className="space-y-6 animate-fadeIn">
                <div className="flex flex-col gap-2">
                    <Link
                        href={`/cms/financeiro/alunos/${aluno.id}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Voltar para {aluno?.name}
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground dark:text-foreground">{competencia?.label}</h1>
                    <p className="text-sm text-muted-foreground">
                        Atualize as informações financeiras desta competência mensal do aluno.
                    </p>
                </div>

                {props.flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {props.flash.success}
                    </div>
                )}

                {props.flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {props.flash.error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalhes da mensalidade</CardTitle>
                                <CardDescription>Valores e datas desta competência</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="valor_previsto">Valor previsto</Label>
                                    <Input
                                        id="valor_previsto"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.data.valor_previsto}
                                        onChange={(event) => form.setData('valor_previsto', event.target.value)}
                                        className={form.errors.valor_previsto ? 'border-red-500' : ''}
                                    />
                                    {form.errors.valor_previsto && (
                                        <p className="text-sm text-red-600">{form.errors.valor_previsto}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="data_vencimento">Data de vencimento</Label>
                                    <Input
                                        id="data_vencimento"
                                        type="date"
                                        value={form.data.data_vencimento}
                                        onChange={(event) => form.setData('data_vencimento', event.target.value)}
                                        className={form.errors.data_vencimento ? 'border-red-500' : ''}
                                    />
                                    {form.errors.data_vencimento && (
                                        <p className="text-sm text-red-600">{form.errors.data_vencimento}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="valor_pago">Valor pago</Label>
                                    <Input
                                        id="valor_pago"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.data.valor_pago}
                                        onChange={(event) => form.setData('valor_pago', event.target.value)}
                                        className={form.errors.valor_pago ? 'border-red-500' : ''}
                                    />
                                    {form.errors.valor_pago && (
                                        <p className="text-sm text-red-600">{form.errors.valor_pago}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="data_pagamento">Data de pagamento</Label>
                                    <Input
                                        id="data_pagamento"
                                        type="date"
                                        value={form.data.data_pagamento}
                                        onChange={(event) => form.setData('data_pagamento', event.target.value)}
                                        className={form.errors.data_pagamento ? 'border-red-500' : ''}
                                    />
                                    {form.errors.data_pagamento && (
                                        <p className="text-sm text-red-600">{form.errors.data_pagamento}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Informações adicionais</CardTitle>
                                <CardDescription>Complementos e observações da cobrança</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="metodo">Método de pagamento</Label>
                                    <Input
                                        id="metodo"
                                        value={form.data.metodo}
                                        onChange={(event) => form.setData('metodo', event.target.value)}
                                        placeholder="Ex.: Pix, cartão, dinheiro"
                                        className={form.errors.metodo ? 'border-red-500' : ''}
                                    />
                                    {form.errors.metodo && (
                                        <p className="text-sm text-red-600">{form.errors.metodo}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="observacao">Observações</Label>
                                    <textarea
                                        id="observacao"
                                        value={form.data.observacao}
                                        onChange={(event) => form.setData('observacao', event.target.value)}
                                        rows={4}
                                        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                                            form.errors.observacao ? 'border-red-500' : ''
                                        }`}
                                        placeholder="Registre observações relevantes, como descontos ou acordos."
                                    />
                                    {form.errors.observacao && (
                                        <p className="text-sm text-red-600">{form.errors.observacao}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status da competência</CardTitle>
                                <CardDescription>Defina a situação atual desta mensalidade</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={(value) => form.setData('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {form.errors.status && (
                                        <p className="text-sm text-red-600">{form.errors.status}</p>
                                    )}
                                </div>

                                <div className="border-t border-border pt-4">
                                    <Button type="submit" className="w-full" disabled={form.processing}>
                                        {form.processing ? 'Salvando...' : 'Salvar alterações'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </CMSLayout>
    );
}
