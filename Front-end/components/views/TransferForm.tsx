import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Client } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Spinner from '../ui/Spinner';
import { ToastContext } from '../../contexts/ToastContext';

const TransferForm: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const toastContext = useContext(ToastContext);

    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [fromClientId, setFromClientId] = useState(location.state?.fromClientId || '');
    const [toClientId, setToClientId] = useState('');
    const [amount, setAmount] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await api.getClients();
                setClients(data);
            } catch (error) {
                toastContext?.showToast('Falha ao buscar clientes para transferência.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fromClient = useMemo(() => clients.find(c => c.id === fromClientId), [clients, fromClientId]);
    const toClient = useMemo(() => clients.find(c => c.id === toClientId), [clients, toClientId]);

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!fromClientId) newErrors.from = 'Selecione a conta de origem.';
        if (!toClientId) newErrors.to = 'Selecione a conta de destino.';
        if (fromClientId === toClientId) newErrors.to = 'A conta de destino deve ser diferente da origem.';
        const numAmount = parseFloat(amount.replace(',', '.'));
        if (isNaN(numAmount) || numAmount <= 0) newErrors.amount = 'O valor deve ser um número positivo.';

        if (fromClient && fromClient.balance < numAmount) {
            newErrors.amount = 'Saldo insuficiente para a transferência.';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsSubmitting(true);
        try {
            await api.transfer(fromClientId, toClientId, parseFloat(amount.replace(',', '.')));
            toastContext?.showToast('Transferência realizada com sucesso!', 'success');
            navigate(`/clients/${fromClientId}`);
        } catch (error: any) {
            toastContext?.showToast(error.message || 'Ocorreu um erro na transferência.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Transferência</h1>
            <p className="text-center text-gray-500 mb-8 max-w-lg mx-auto">Selecione as contas, informe o valor e confirme a operação.</p>
            <Card className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                        {/* FROM ACCOUNT */}
                        <div className="w-full md:col-span-2">
                             <label htmlFor="fromClientId" className="block text-sm font-medium text-gray-700 mb-1">De (Remetente)</label>
                            <select
                                id="fromClientId"
                                value={fromClientId}
                                onChange={(e) => setFromClientId(e.target.value)}
                                className={`w-full p-2.5 bg-white border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.from ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Selecione uma conta</option>
                                {clients.map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                            {fromClient && (
                                <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                                    Saldo: <span className="font-semibold">{fromClient.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            )}
                             {errors.from && <p className="mt-1 text-sm text-red-600">{errors.from}</p>}
                        </div>

                        {/* Arrow Icon */}
                        <div className="text-center text-gray-400 self-center pt-8">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                            </svg>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mx-auto md:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                            </svg>
                        </div>
                        
                        {/* TO ACCOUNT */}
                        <div className="w-full md:col-span-2">
                             <label htmlFor="toClientId" className="block text-sm font-medium text-gray-700 mb-1">Para (Destinatário)</label>
                            <select
                                id="toClientId"
                                value={toClientId}
                                onChange={(e) => setToClientId(e.target.value)}
                                className={`w-full p-2.5 bg-white border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.to ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={!fromClientId}
                            >
                                <option value="">Selecione uma conta</option>
                                {clients.filter(c => c.id !== fromClientId).map(client => (
                                    <option key={client.id} value={client.id}>{client.name}</option>
                                ))}
                            </select>
                            {toClient && (
                                <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
                                    Cliente: <span className="font-semibold">{toClient.name}</span>
                                </div>
                            )}
                             {errors.to && <p className="mt-1 text-sm text-red-600">{errors.to}</p>}
                        </div>
                    </div>

                    {/* AMOUNT & SUBMIT */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="max-w-xs mx-auto">
                            <Input
                                id="amount"
                                label="Valor da Transferência"
                                type="text"
                                value={amount}
                                onChange={e => setAmount(e.target.value.replace(/[^0-9,.]/g, ''))}
                                placeholder="0,00"
                                error={errors.amount}
                                required
                                className="text-center text-2xl font-bold p-3"
                            />
                        </div>
                        <div className="mt-8 flex justify-center">
                            <Button type="submit" isLoading={isSubmitting} className="px-8 py-3 text-lg font-bold" disabled={!fromClientId || !toClientId || !amount}>
                                Confirmar Transferência
                            </Button>
                        </div>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default TransferForm;