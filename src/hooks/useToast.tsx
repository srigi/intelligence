import { useState } from 'react';

import { ToastRoot, ToastDescription, ToastTitle, ToastViewport } from '~/components/ui/Toast';
import { delay } from '~/utils/delay';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'info';
  duration?: number;
}

interface ToastState {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'info';
  open: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    variant: 'default',
  });

  const showToast = async ({ title, description, variant = 'default', duration = 2500 }: ToastOptions) => {
    setToast({ title, description, variant, open: true });

    if (duration > 0) {
      await delay(duration);
      hideToast();
    }
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const Toaster = () => (
    <>
      <ToastViewport className="ToastViewport" />
      <ToastRoot
        className={`ToastRoot ${toast.variant === 'info' ? 'border-blue-300 bg-blue-100' : ''}`}
        open={toast.open}
        onOpenChange={(open) => setToast((prev) => ({ ...prev, open }))}
      >
        {toast.title && <ToastTitle className="font-medium">{toast.title}</ToastTitle>}
        {toast.description && (
          <ToastDescription asChild>
            <span>{toast.description}</span>
          </ToastDescription>
        )}
      </ToastRoot>
    </>
  );

  return {
    Toaster,
    showToast,
    hideToast,
  };
}
