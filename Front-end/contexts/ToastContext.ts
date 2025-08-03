
import React from 'react';

interface ToastContextType {
    showToast: (message: string, type: 'success' | 'error') => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(undefined);
