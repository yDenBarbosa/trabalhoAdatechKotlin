import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../services/api';
import { Client } from '../../types';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await api.getClients();
                setClients(data);
            } catch (error) {
                console.error("Failed to fetch clients for dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchClients();
    }, []);

    const stats = useMemo(() => {
        const totalClients = clients.length;
        const totalBalance = clients.reduce((acc, client) => acc + client.saldoInicial, 0);
        return { totalClients, totalBalance };
    }, [clients]);

    if (isLoading) {
        return <Spinner />;
    }

    const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
        <Card className="p-6 flex items-center">
            <div className="p-3 rounded-full bg-blue-100 mr-4 text-blue-600">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
            </div>
        </Card>
    );

    return (
        <div className="animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard 
                    title="Total de Clientes" 
                    value={stats.totalClients} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.125-1.273-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.125-1.273.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                />
                <StatCard 
                    title="Saldo Total em Contas" 
                    value={stats.totalBalance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01M12 18v-1m0-1v.01m0-2.01V14m0-1.99V12m0 6v2m0-2v.01M12 20v-1m0-1v.01M12 18v-2m-8-4a8 8 0 1116 0 8 8 0 01-16 0z" /></svg>}
                />
            </div>
            <div className="mt-8">
                <Card>
                    <div className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
                        <div className="flex flex-wrap gap-4">
                            <Link to="/clients/new" className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md font-bold transition-colors">
                                Novo Cliente
                            </Link>
                             <Link to="/transfer" className="bg-black text-white hover:bg-gray-800 px-4 py-2 rounded-md font-bold transition-colors">
                                Nova Transferência
                            </Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;