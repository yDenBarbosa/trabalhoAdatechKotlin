
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Client, NewClientData, UpdateClientData } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { ToastContext } from '../../contexts/ToastContext';
import Spinner from '../ui/Spinner';

interface ClientFormProps {
    client?: Client;
    onSuccess?: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client: initialClient, onSuccess }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const toastContext = useContext(ToastContext);

    const [formData, setFormData] = useState({
        nomeCompleto: '',
        cpf: '',
        email: '',
        telefone: '',
        saldoInicial: '0',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditMode = !!id;

    useEffect(() => {
        if (isEditMode && !initialClient) {
            setIsFetching(true);
            api.getClientById(id)
                .then(data => {
                    setFormData({
                        name: data.nomeCompleto,
                        cpf: data.cpf,
                        email: data.email,
                        telefone: data.telefone,
                        saldoInicial: String(data.saldoInicial)
                    });
                })
                .catch(err => toastContext?.showToast(err.message || 'Falha ao buscar cliente', 'error'))
                .finally(() => setIsFetching(false));
        } else if (initialClient) {
             setFormData({
                nomeCompleto: initialClient.nomeCompleto,
                cpf: initialClient.cpf,
                email: initialClient.email,
                telefone: initialClient.telefone,
                saldoInicial: String(initialClient.saldoInicial)
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, initialClient]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!formData.nomeCompleto.trim()) newErrors.nomeCompleto = 'Nome completo é obrigatório';
       // if (!formData.cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) newErrors.cpf = 'CPF inválido (use o formato XXX.XXX.XXX-XX)';
        if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = 'E-mail inválido';
        if (!formData.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
        if (!isEditMode && parseFloat(formData.saldoInicial) < 0) newErrors.saldoInicial = 'Saldo inicial não pode ser negativo';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsLoading(true);
        try {
            if (isEditMode) {
                const updatedData: UpdateClientData = {
                    nomeCompleto: formData.nomeCompleto,
                    email: formData.email,
                    telefone: formData.telefone
                };
                await api.updateClient(id!, updatedData);
                toastContext?.showToast('Cliente atualizado com sucesso!', 'success');
            } else {
                const newData: NewClientData = {
                    ...formData,
                    saldoInicial: parseFloat(formData.saldoInicial),
                };
                await api.createClient(newData);
                toastContext?.showToast('Cliente criado com sucesso!', 'success');
            }
            if(onSuccess) {
                onSuccess();
            } else {
                navigate('/clients');
            }
        } catch (error: any) {
            toastContext?.showToast(error.message || 'Ocorreu um erro.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isFetching) return <Spinner />;

    return (
        <Card className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 p-6 border-b">
                {isEditMode ? 'Editar Cliente' : 'Novo Cliente'}
            </h1>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input id="nomeCompleto" name="nomeCompleto" label="Nome Completo" value={formData.nomeCompleto} onChange={handleChange} error={errors.nomeCompleto} required />
                <Input id="cpf" name="cpf" label="CPF" value={formData.cpf} onChange={handleChange} error={errors.cpf} required disabled={isEditMode} placeholder="123.456.789-00"/>
                <Input id="email" name="email" type="email" label="E-mail" value={formData.email} onChange={handleChange} error={errors.email} required />
                <Input id="telefone" name="telefone" type="tel" label="Telefone" value={formData.telefone} onChange={handleChange} error={errors.telefone} required />
                {!isEditMode && (
                    <Input id="saldoInicial" name="saldoInicial" type="number" label="Saldo Inicial (R$)" value={formData.saldoInicial} onChange={handleChange} error={errors.saldoInicial} step="0.01" min="0" required />
                )}
                <div className="flex justify-end pt-4">
                    <Button type="submit" isLoading={isLoading}>
                        {isEditMode ? 'Salvar Alterações' : 'Cadastrar Cliente'}
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default ClientForm;