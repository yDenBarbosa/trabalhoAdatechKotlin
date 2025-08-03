import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Dashboard from './components/views/Dashboard';
import ClientList from './components/views/ClientList';
import ClientForm from './components/views/ClientForm';
import ClientDetails from './components/views/ClientDetails';
import TransferForm from './components/views/TransferForm';
import Toast from './components/ui/Toast';
import { ToastMessage } from './types';
import { ToastContext } from './contexts/ToastContext';

const App: React.FC = () => {
    const [toast, setToast] = useState<ToastMessage | null>(null);

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast(null);
        }, 5000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            <HashRouter>
                <div className="min-h-screen text-gray-800">
                    <Header />
                    <main className="max-w-7xl mx-4 lg:mx-auto my-8 p-6 bg-white rounded-xl shadow-lg">
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/clients" element={<ClientList />} />
                            <Route path="/clients/new" element={<ClientForm />} />
                            <Route path="/clients/:id" element={<ClientDetails />} />
                            <Route path="/transfer" element={<TransferForm />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </main>
                    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                </div>
            </HashRouter>
        </ToastContext.Provider>
    );
};

export default App;