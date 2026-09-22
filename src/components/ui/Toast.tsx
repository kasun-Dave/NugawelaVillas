import { type ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { type Toast, subscribeToasts } from './toast-utils';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return subscribeToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 4000);
    });
  }, []);

  return (
    <>
      {children}
      {createPortal(
        <div
          className="fixed bottom-4 right-4 z-50 flex max-w-sm flex-col gap-2"
          aria-live="polite"
          aria-label="Notifications"
        >
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-lg',
                toast.type === 'success' && 'bg-forest text-ivory',
                toast.type === 'error' && 'bg-terracotta text-ivory',
                toast.type === 'info' && 'bg-charcoal text-ivory',
              )}
              role="status"
            >
              <span>{toast.message}</span>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="ml-auto shrink-0 rounded p-0.5 hover:bg-white/20"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}
