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
import FinanceiroTabs from '../components/Tabs';

export default function Competencia({ colaborador, competencia, registro = {}, statusOptions = [], tabs = [] }) {
    const { props } = usePage();

    const form = useForm({
        valor_previsto: registro?.valor_previsto ?? '',
        data_prevista: registro?.data_prevista ?? '',
        valor_pago: registro?.valor_pago ?? '',
        data_pagamento: registro?.data_pagamento ?? '',
        metodo: registro?.metodo ?? '',
        status: registro?.status ?? 'aberto',
        observacao: registro?.observacao ?? '',
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        form.put(`/cms/financeiro/colaboradores/${colaborador.id}/competencias/${competencia.valor}`);
    };

    return (
        <CMSLayout>
            <Head title={`Financeiro - ${colaborador?.name} (${competencia?.valor})`} />

            <div className="space-y-6 animate-fadeIn">
                <FinanceiroTabs tabs={tabs} className="justify-start md:justify-end" />
                <div className="flex flex-col gap-2">
                    <Link
                        href={`/cms/financeiro/colaboradores/${colaborador.id}`}
                        className="text-sm text-muted-foreground hover:text-foreground"
                    >
                        ← Voltar para {colaborador?.name}
                    </Link>
                    <h1 className="text-3xl font-bold text-foreground dark:text-foreground">{competencia?.label}</h1>
                    <p className="text-sm text-muted-foreground">
                        Atualize as informações financeiras desta competência mensal do colaborador.
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
                                <CardTitle>Detalhes da competência</CardTitle>
                                <CardDescription>Valores previstos e datas deste lançamento</CardDescription>
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
                                    <Label htmlFor="data_prevista">Data prevista</Label>
                                    <Input
                                        id="data_prevista"
                                        type="date"
                                        value={form.data.data_prevista}
                                        onChange={(event) => form.setData('data_prevista', event.target.value)}
                                        className={form.errors.data_prevista ? 'border-red-500' : ''}
                                    />
                                    {form.errors.data_prevista && (
                                        <p className="text-sm text-red-600">{form.errors.data_prevista}</p>
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
                                <CardDescription>Complementos e observações do pagamento</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="metodo">Método de pagamento</Label>
                                    <Input
                                        id="metodo"
                                        value={form.data.metodo}
                                        onChange={(event) => form.setData('metodo', event.target.value)}
                                        placeholder="Ex.: Pix, transferência, dinheiro"
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
                                        placeholder="Registre observações relevantes, como acordos ou descontos."
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
                                <CardDescription>Defina a situação atual deste lançamento</CardDescription>
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

                                <Button type="submit" className="w-full" disabled={form.processing}>
                                    {form.processing ? 'Salvando...' : 'Salvar alterações'}
                                </Button>
                                {form.recentlySuccessful && (
                                    <p className="text-sm text-green-600">Alterações salvas com sucesso!</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </CMSLayout>
    );
}
