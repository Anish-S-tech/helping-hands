'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastProps {
    toast: Toast;
    onClose: (id: string) => void;
}

const ICONS = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const COLORS = {
    success: 'bg-green-500/20 border-green-500/50 text-green-400',
    error: 'bg-red-500/20 border-red-500/50 text-red-400',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400',
};

function ToastItem({ toast, onClose }: ToastProps) {
    const Icon = ICONS[toast.type];

    useEffect(() => {
        if (toast.duration) {
            const timer = setTimeout(() => {
                onClose(toast.id);
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.id, toast.duration, onClose]);

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm min-w-[300px] max-w-md shadow-lg animate-in slide-in-from-right ${COLORS[toast.type]}`}
        >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <p className="flex-1 text-sm font-medium text-white">{toast.message}</p>
            <button
                onClick={() => onClose(toast.id)}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

let toastCount = 0;
let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toastsState: Toast[] = [];

function emitChange() {
    toastListeners.forEach(listener => listener(toastsState));
}

export const toast = {
    success: (message: string, duration = 3000) => {
        const id = `toast-${++toastCount}`;
        toastsState = [...toastsState, { id, type: 'success', message, duration }];
        emitChange();
        return id;
    },
    error: (message: string, duration = 4000) => {
        const id = `toast-${++toastCount}`;
        toastsState = [...toastsState, { id, type: 'error', message, duration }];
        emitChange();
        return id;
    },
    info: (message: string, duration = 3000) => {
        const id = `toast-${++toastCount}`;
        toastsState = [...toastsState, { id, type: 'info', message, duration }];
        emitChange();
        return id;
    },
    warning: (message: string, duration = 3000) => {
        const id = `toast-${++toastCount}`;
        toastsState = [...toastsState, { id, type: 'warning', message, duration }];
        emitChange();
        return id;
    },
    dismiss: (id: string) => {
        toastsState = toastsState.filter(t => t.id !== id);
        emitChange();
    },
};

export function ToastContainer() {
    const [toasts, setToasts] = useState<Toast[]>([]);

    useEffect(() => {
        toastListeners.push(setToasts);
        return () => {
            toastListeners = toastListeners.filter(l => l !== setToasts);
        };
    }, []);

    const handleClose = (id: string) => {
        toastsState = toastsState.filter(t => t.id !== id);
        emitChange();
    };

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onClose={handleClose} />
            ))}
        </div>
    );
}
