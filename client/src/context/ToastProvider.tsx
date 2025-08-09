import React, { useCallback, useState } from "react";
import Toast from "../components/common/Toast";
import { ToastContext, type ToastItem, type ToastType } from "./ToastContext";

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const newToast: ToastItem = { id: String(Date.now()), type, message };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed flex w-screen h-screen top-0 z-[500] justify-center pointer-events-none">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            type={t.type}
            message={t.message}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
