
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Client } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import ClientForm from './ClientForm';
import { ToastContext } from '../../contexts/ToastContext';

const ClientDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toastContext = useContext(ToastContext);

    const [client, setClient] = useState<Client | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDepositModalOpen, setDepositModalOpen] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchClient = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        try {
            const data = await api.getClientById(id);
            setClient(data);
        } catch (error) {
            console.error("Failed to fetch client:", error);
            toastContext?.showToast('Cliente não encontrado.', 'error');
            navigate('/clients');
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate, toastContext]);

    useEffect(() => {
        fetchClient();
    }, [fetchClient]);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            toastContext?.showToast('Por favor, insira um valor de depósito válido.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            await api.deposit(id!, amount);
            toastContext?.showToast('Depósito realizado com sucesso!', 'success');
            setDepositModalOpen(false);
            setDepositAmount('');
            fetchClient();
        } catch (error: any) {
            toastContext?.showToast(error.message || 'Falha ao realizar depósito.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (isLoading) {
        return <Spinner />;
    }

    if (!client) {
        return <div className="text-center text-gray-500">Cliente não encontrado.</div>;
    }

    return (
        <div className="animate-fade-in">
            <Link to="/clients" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Voltar para a lista de clientes</Link>
            <Card>
                <div className="p-6">
                    <div className="md:flex md:justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                            <p className="text-gray-500 mt-1">ID do Cliente: {client.id}</p>
                        </div>
                        <div className="mt-4 md:mt-0 text-left md:text-right">
                            <p className="text-lg text-gray-500">Saldo Atual</p>
                            <p className="text-4xl font-extrabold text-green-600">{client.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                        </div>
                    </div>

                    <div className="mt-6 border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold text-gray-900">Informações de Contato</h3>
                            <p className="text-gray-600"><strong>CPF:</strong> {client.cpf}</p>
                            <p className="text-gray-600"><strong>E-mail:</strong> {client.email}</p>
                            <p className="text-gray-600"><strong>Telefone:</strong> {client.telefone}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold text-gray-900">Outras Informações</h3>
                            <p className="text-gray-600"><strong>Cliente desde:</strong> {new Date(client.dataCadastro).toLocaleDateString('pt-BR')}</p>
                        </div>
                    </div>

                    <div className="mt-8 border-t border-gray-200 pt-6 flex flex-wrap gap-4">
                        <Button onClick={() => setEditModalOpen(true)}>Editar Informações</Button>
                        <Button variant="secondary" onClick={() => setDepositModalOpen(true)}>Fazer Depósito</Button>
                        <Button variant="secondary" onClick={() => navigate('/transfer', { state: { fromClientId: client.id } })}>Iniciar Transferência</Button>
                    </div>
                </div>
            </Card>

            {/* Edit Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} title="Editar Cliente">
                <ClientForm client={client} onSuccess={() => { setEditModalOpen(false); fetchClient(); }} />
            </Modal>

            {/* Deposit Modal */}
            <Modal isOpen={isDepositModalOpen} onClose={() => setDepositModalOpen(false)} title="Realizar Depósito">
                <form onSubmit={handleDeposit} className="space-y-4">
                    <p>Realizando depósito para <strong>{client.name}</strong>.</p>
                    <Input
                        id="depositAmount"
                        label="Valor do Depósito (R$)"
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0.01"
                        required
                    />
                    <div className="flex justify-end">
                        <Button type="submit" isLoading={isSubmitting}>Confirmar Depósito</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ClientDetails;