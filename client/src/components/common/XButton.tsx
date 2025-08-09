import { X } from "lucide-react";
import type { ErrorsState } from "../../helpers/handleError";

interface XButtonProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
}

const XButton: React.FC<XButtonProps> = ({ setIsModalOpen, setErrors }) => {
  return (
    <button
      onClick={() => {
        setIsModalOpen(false);
        setErrors(null);
      }}
      className="text-gray-400 hover:text-primary hover:cursor-pointer transition-all duration-200 p-2"
    >
      <X className="h-5 w-5" />
    </button>
  );
};

export default XButton;
