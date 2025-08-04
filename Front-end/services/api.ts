import { Client, NewClientData, UpdateClientData, Transaction, Deposit } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const realApi = {
    // Função auxiliar para tratar respostas da API real
    handleApiResponse: async <T>(response: Response): Promise<T> => {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Ocorreu um erro na comunicação com o servidor.' }));
            throw new Error(errorData.message || `Erro ${response.status}`);
        }
        const text = await response.text();
        if (!text) {
            throw new Error('Resposta vazia do servidor.');
        }
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('Resposta do servidor não é um JSON válido.');
        }
    },

    getClients: async function(): Promise<Client[]> {
        const response = await fetch(`${API_BASE_URL}/clientes`);
        return realApi.handleApiResponse<Client[]>(response);
    },
    getClientById: async function(id: string): Promise<Client> {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
        return realApi.handleApiResponse<Client>(response);
    },
    createClient: async function(data: Client): Promise<Client> {
        const response = await fetch(`${API_BASE_URL}/clientes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return realApi.handleApiResponse<Client>(response);
    },
    updateClient: async function(id: string, data: UpdateClientData): Promise<Client> {
        const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return realApi.handleApiResponse<Client>(response);
    },
    deposit: async function(clientId: string, valor: number): Promise<Deposit> {
        const response = await fetch(`${API_BASE_URL}/clientes/${clientId}/deposito`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ valor }),
        });
        return realApi.handleApiResponse<Deposit>(response);
    },
    transfer: async function(fromId: string, toId: string, amount: number): Promise<Transaction> {
        const response = await fetch(`${API_BASE_URL}/transfers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fromClientId: fromId, toClientId: toId, amount }),
        });
        return realApi.handleApiResponse<Transaction>(response);
    }
};

export const api = realApi;
