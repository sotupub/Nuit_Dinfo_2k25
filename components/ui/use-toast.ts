import { useState } from 'react';

export interface Toast {
  id?: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (options: Toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...options, id };
    
    setToasts((currentToasts) => [...currentToasts, newToast]);

    // Automatically remove toast after 5 seconds
    setTimeout(() => {
      setToasts((currentToasts) => 
        currentToasts.filter((t) => t.id !== id)
      );
    }, 5000);

    return id;
  };

  const dismiss = (id?: string) => {
    setToasts((currentToasts) => 
      currentToasts.filter((t) => t.id !== id)
    );
  };

  const dismissAll = () => {
    setToasts([]);
  };

  return {
    toast,
    dismiss,
    dismissAll,
    toasts
  };
}
