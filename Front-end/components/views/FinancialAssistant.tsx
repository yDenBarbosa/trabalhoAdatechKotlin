
import React, { useState, useRef, useEffect } from 'react';
import { getFinancialAdvice } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const FinancialAssistant: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;

        const userMessage: ChatMessage = { id: String(Date.now()), role: 'user', text: userInput };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        try {
            const modelResponse = await getFinancialAdvice(userInput);
            const modelMessage: ChatMessage = { id: String(Date.now() + 1), role: 'model', text: modelResponse };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            const errorMessage: ChatMessage = { id: String(Date.now() + 1), role: 'model', text: 'Desculpe, ocorreu um erro. Tente novamente.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
             <h1 className="text-3xl font-bold text-gray-900 mb-6">Assistente Financeiro</h1>
            <Card className="flex flex-col h-[70vh]">
                <div ref={chatContainerRef} className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500">
                           <p className="text-lg">Olá! Como posso ajudar com suas dúvidas financeiras hoje?</p>
                           <p className="text-sm mt-2">Você pode perguntar sobre investimentos, poupança, orçamento e mais.</p>
                        </div>
                    )}
                    {messages.map(msg => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                             {msg.role === 'model' && (
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                    A
                                </div>
                            )}
                            <div className={`max-w-lg px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-end gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                                A
                            </div>
                            <div className="max-w-lg px-4 py-3 rounded-lg bg-gray-200">
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Digite sua pergunta..."
                            className="flex-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            disabled={isLoading}
                        />
                        <Button type="submit" isLoading={isLoading} disabled={!userInput.trim()}>
                            Enviar
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default FinancialAssistant;