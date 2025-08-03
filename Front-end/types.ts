
export interface Client {
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  balance: number;
  createdAt: string;
}

export type NewClientData = Omit<Client, 'id' | 'createdAt'>;

export type UpdateClientData = Partial<Pick<Client, 'name' | 'email' | 'phone'>>;

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
