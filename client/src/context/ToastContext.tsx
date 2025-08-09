import { createContext } from "react";

export type ToastType = "Success" | "Warning" | "Error";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

export interface ToastContextType {
  addToast: (type: ToastType, message: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
