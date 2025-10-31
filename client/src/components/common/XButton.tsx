import { X } from "lucide-react";
import type { ErrorsState } from "../../helpers/handleError";

interface XButtonProps<T extends string | null> {
  setIsModalOpen?: React.Dispatch<React.SetStateAction<T>>;
  setErrors?: React.Dispatch<React.SetStateAction<ErrorsState>>;
  onClick?: () => void;
}

const XButton = <T extends string | null>({
  setIsModalOpen,
  setErrors,
  onClick,
}: XButtonProps<T>) => (
  <button
    onClick={() => {
      if (onClick) onClick();
      else {
        setIsModalOpen?.(null as T);
        setErrors?.(null);
      }
    }}
    className="text-gray-400 hover:text-primary hover:cursor-pointer transition-all duration-200 p-2"
  >
    <X className="h-5 w-5" />
  </button>
);

export default XButton;
