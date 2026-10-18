// DUO OS — Sleek Toast Alert Context
import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'partner';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toast: (title: string, options?: { type?: ToastType; message?: string; duration?: number }) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  partner: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  toast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
  partner: () => {}
});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((title: string, options?: { type?: ToastType; message?: string; duration?: number }) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const newToast: Toast = {
      id,
      title,
      type: options?.type || 'info',
      message: options?.message,
      duration: options?.duration || 4000
    };

    setToasts(prev => [...prev.slice(-4), newToast]); // Keep max 5 visible

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }
  }, [removeToast]);

  const value = {
    toast: addToast,
    success: (title: string, message?: string) => addToast(title, { type: 'success', message }),
    error: (title: string, message?: string) => addToast(title, { type: 'error', message }),
    info: (title: string, message?: string) => addToast(title, { type: 'info', message }),
    partner: (title: string, message?: string) => addToast(title, { type: 'partner', message })
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast rendering portal */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              t.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200'
                : t.type === 'error'
                ? 'bg-rose-950/80 border-rose-500/30 text-rose-200'
                : t.type === 'partner'
                ? 'bg-violet-950/85 border-violet-500/40 text-violet-200 shadow-[0_0_20px_-3px_rgba(139,92,246,0.3)]'
                : 'bg-slate-900/90 border-slate-700/60 text-slate-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {t.type === 'partner' && <Bell className="w-5 h-5 text-violet-400 animate-bounce" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-sky-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-semibold tracking-tight text-white">{t.title}</h5>
              {t.message && <p className="text-xs text-slate-300/90 mt-0.5 leading-relaxed">{t.message}</p>}
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="text-slate-400 hover:text-white transition-colors p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
