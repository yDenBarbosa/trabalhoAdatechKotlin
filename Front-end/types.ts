
export interface Client {
  nomeCompleto: string;
  cpf: string;
  email: string;
  telefone: string;
  saldoInicial: number;
  
}

export type NewClientData = Omit<Client, 'id' | 'dataCadastro'>;

export type UpdateClientData = Partial<Pick<Client, 'nomeCompleto' | 'email' | 'telefone'>>;

export interface Transaction {
  id: string;
  fromClientId: string;
  toClientId: string;
  amount: number;
  timestamp: string;
}

export interface Deposit {
    id: string;
    clientId: string;
    amount: number;
    timestamp: string;
}

export interface ToastMessage {
  message: string;
  type: 'success' | 'error';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}
