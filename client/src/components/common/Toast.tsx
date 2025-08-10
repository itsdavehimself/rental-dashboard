import { useEffect } from "react";

const styles = {
  Success: "bg-green-100 border-green-500 text-green-900",
  Warning: "bg-yellow-100 border-yellow-500 text-yellow-900",
  Error: "bg-red-100 border-red-500 text-red-900",
} as const;

export interface ToastProps {
  id: string;
  type: keyof typeof styles;
  message: string;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ id, type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, onClose]);

  return (
    <div
      className={`border-1 rounded-lg px-4 py-2 text-sm shadow-md ${styles[type]} z-500`}
    >
      <span className="font-semibold">{type}:</span> {message}
    </div>
  );
};

export default Toast;
