import { Client, NewClientData, UpdateClientData, Transaction, Deposit } from '../types';

/*
Para ativar a sua API, você só precisa fazer duas coisas:
Inserir a URL do seu backend na constante API_BASE_URL.
Mudar a variável USE_MOCK_API para false.
*/


// --- CONFIGURAÇÃO DA API ---

// **PASSO 1**: Defina a URL base da sua API aqui.
// Exemplo: 'https://api.meubanco.com/v1'
const API_BASE_URL = 'COLOQUE_A_URL_DA_SUA_API_AQUI';

// **PASSO 2**: Mude para `false` quando sua API estiver pronta para ser usada.
// Se `true`, a aplicação usará dados fictícios salvos no navegador.
const USE_MOCK_API = true;


// --- CÓDIGO PARA CONEXÃO COM API REAL (COMENTADO) ---
// Esta seção contém o código que será usado quando USE_MOCK_API for `false`.
// Para ativar, descomente este bloco e siga as instruções na seção de EXPORTAÇÃO no final do arquivo.

/*
const realApi = {
    // Função auxiliar para tratar respostas da API real
    handleApiResponse: async function<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Ocorreu um erro na comunicação com o servidor.' }));
            throw new Error(errorData.message || `Erro ${response.status}`);
        }
        return response.json();
    },

    getClients: async function(): Promise<Client[]> {
        const response = await fetch(`${API_BASE_URL}/clients`);
        return this.handleApiResponse<Client[]>(response);
    },
    getClientById: async function(id: string): Promise<Client> {
        const response = await fetch(`${API_BASE_URL}/clients/${id}`);
        return this.handleApiResponse<Client>(response);
    },
    createClient: async function(data: NewClientData): Promise<Client> {
        const response = await fetch(`${API_BASE_URL}/clients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleApiResponse<Client>(response);
    },
    updateClient: async function(id: string, data: UpdateClientData): Promise<Client> {
         const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
            method: 'PUT', // ou 'PATCH'
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return this.handleApiResponse<Client>(response);
    },
    deposit: async function(clientId: string, amount: number): Promise<Deposit> {
        const response = await fetch(`${API_BASE_URL}/clients/${clientId}/deposit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }),
        });
        return this.handleApiResponse<Deposit>(response);
    },
    transfer: async function(fromId: string, toId: string, amount: number): Promise<Transaction> {
        const response = await fetch(`${API_BASE_URL}/transfers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fromClientId: fromId, toClientId: toId, amount }),
        });
        return this.handleApiResponse<Transaction>(response);
    }
};
*/


// --- IMPLEMENTAÇÃO DE DADOS FICTÍCIOS (MOCK API com localStorage) ---
// Esta seção é usada quando USE_MOCK_API é `true`.

const CLIENTS_KEY = 'digital-bank-clients';
const TRANSACTIONS_KEY = 'digital-bank-transactions';
const DEPOSITS_KEY = 'digital-bank-deposits';

const simulateDelay = <T>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 300));

const getClientsFromStorage = (): Client[] => JSON.parse(localStorage.getItem(CLIENTS_KEY) || '[]');
const saveClientsToStorage = (clients: Client[]) => localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
const getTransactionsFromStorage = (): Transaction[] => JSON.parse(localStorage.getItem(TRANSACTIONS_KEY) || '[]');
const saveTransactionsToStorage = (transactions: Transaction[]) => localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
const getDepositsFromStorage = (): Deposit[] => JSON.parse(localStorage.getItem(DEPOSITS_KEY) || '[]');
const saveDepositsToStorage = (deposits: Deposit[]) => localStorage.setItem(DEPOSITS_KEY, JSON.stringify(deposits));

// Inicializa com dados fictícios se não houver nada no localStorage
const initializeMockData = () => {
    if (!localStorage.getItem(CLIENTS_KEY)) {
        const initialClients: Client[] = [
            { id: '1', name: 'Ada Lovelace', cpf: '111.111.111-11', email: 'ada@example.com', phone: '11999999991', balance: 5000, createdAt: new Date(2023, 0, 15).toISOString() },
            { id: '2', name: 'Grace Hopper', cpf: '222.222.222-22', email: 'grace@example.com', phone: '11999999992', balance: 8500, createdAt: new Date(2023, 2, 20).toISOString() },
            { id: '3', name: 'Margaret Hamilton', cpf: '333.333.333-33', email: 'margaret@example.com', phone: '11999999993', balance: 12000, createdAt: new Date(2023, 5, 10).toISOString() },
        ];
        saveClientsToStorage(initialClients);
    }
};
initializeMockData();

const mockApi = {
    getClients: async (): Promise<Client[]> => simulateDelay(getClientsFromStorage()),
    getClientById: async (id: string): Promise<Client> => {
        const client = getClientsFromStorage().find(c => c.id === id);
        if (!client) return simulateDelay(Promise.reject(new Error('Cliente não encontrado')));
        return simulateDelay(client);
    },
    createClient: async (data: NewClientData): Promise<Client> => {
        const clients = getClientsFromStorage();
        const newClient: Client = { id: String(Date.now()), ...data, createdAt: new Date().toISOString() };
        saveClientsToStorage([...clients, newClient]);
        return simulateDelay(newClient);
    },
    updateClient: async (id: string, data: UpdateClientData): Promise<Client> => {
        const clients = getClientsFromStorage();
        const clientIndex = clients.findIndex(c => c.id === id);
        if (clientIndex === -1) return simulateDelay(Promise.reject(new Error('Cliente não encontrado')));
        const updatedClient = { ...clients[clientIndex], ...data };
        clients[clientIndex] = updatedClient;
        saveClientsToStorage(clients);
        return simulateDelay(updatedClient);
    },
    deposit: async (clientId: string, amount: number): Promise<Deposit> => {
        const clients = getClientsFromStorage();
        const clientIndex = clients.findIndex(c => c.id === clientId);
        if (clientIndex === -1) return simulateDelay(Promise.reject(new Error('Cliente não encontrado')));
        clients[clientIndex].balance += amount;
        saveClientsToStorage(clients);
        const newDeposit: Deposit = { id: String(Date.now()), clientId, amount, timestamp: new Date().toISOString() };
        saveDepositsToStorage([...getDepositsFromStorage(), newDeposit]);
        return simulateDelay(newDeposit);
    },
    transfer: async (fromId: string, toId: string, amount: number): Promise<Transaction> => {
        const clients = getClientsFromStorage();
        const fromClientIndex = clients.findIndex(c => c.id === fromId);
        const toClientIndex = clients.findIndex(c => c.id === toId);
        if (fromClientIndex === -1 || toClientIndex === -1) return simulateDelay(Promise.reject(new Error('Cliente de origem ou destino não encontrado')));
        if (clients[fromClientIndex].balance < amount) return simulateDelay(Promise.reject(new Error('Saldo insuficiente')));
        clients[fromClientIndex].balance -= amount;
        clients[toClientIndex].balance += amount;
        saveClientsToStorage(clients);
        const newTransaction: Transaction = { id: String(Date.now()), fromClientId: fromId, toClientId: toId, amount, timestamp: new Date().toISOString() };
        saveTransactionsToStorage([...getTransactionsFromStorage(), newTransaction]);
        return simulateDelay(newTransaction);
    }
};

// --- EXPORTAÇÃO ---
// Exporta a implementação fictícia ou a real, com base na flag `USE_MOCK_API`.
const apiToExport = USE_MOCK_API 
    ? mockApi 
    : { 
        // Se USE_MOCK_API for false, mas `realApi` estiver comentado, estas funções de erro serão usadas.
        // **PARA ATIVAR A API REAL**: Descomente o bloco `realApi` acima e substitua este objeto por `realApi`.
        // Ex: `const apiToExport = USE_MOCK_API ? mockApi : realApi;`
        getClients: async () => { throw new Error('API Real não implementada. Configure services/api.ts'); },
        getClientById: async () => { throw new Error('API Real não implementada. Configure services/api.ts'); },
        createClient: async () => { throw new Error('API Real não implementada. Configure services/api.ts'); },
        updateClient: async () => { throw new Error('API Real não implementada. Configure services/api.ts'); },
        deposit: async () => { throw new Error('API Real não implementada. Configure services/api.ts'); },
        transfer: async () => { throw new Error('API Real não implementada. Configure services/api.ts'); },
    };

export const api = apiToExport;
