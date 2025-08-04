
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Client } from '../../types';
import Spinner from '../ui/Spinner';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { ToastContext } from '../../contexts/ToastContext';

const ClientList: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const toastContext = useContext(ToastContext);

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true);
            try {
                const data = await api.getClients();
                console.log('data', data)
                setClients(data);
            } catch (error) {
                console.error("Failed to fetch clients:", error);
                toastContext?.showToast('Falha ao buscar clientes.', 'error');
            } finally {
                setIsLoading(false);
            }
        };
        fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
                <Link to="/clients/new">
                    <Button variant="primary">Adicionar Cliente</Button>
                </Link>
            </div>
            {clients.length > 0 ? (
                <Card className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPF</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-mail</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Ações</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.nomeCompleto}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.cpf}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/clients/${client.id}`} className="text-blue-600 hover:text-blue-900">
                                            Detalhes
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            ) : (
                <Card className="text-center p-8">
                    <p className="text-gray-500">Nenhum cliente cadastrado ainda.</p>
                </Card>
            )}
        </div>
    );
};

export default ClientList;