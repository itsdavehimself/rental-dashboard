import { X } from "lucide-react";
import type { ErrorsState } from "../../helpers/handleError";
import { useAppDispatch } from "../../app/hooks";
import { closeModal } from "../../app/slices/uiSlice";

interface XButtonProps {
  setErrors?: React.Dispatch<React.SetStateAction<ErrorsState>>;
  onClick?: () => void;
}

const XButton: React.FC<XButtonProps> = ({ setErrors, onClick }) => {
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => {
        if (onClick) onClick();
        else {
          dispatch(closeModal());
          setErrors?.(null);
        }
      }}
      className="text-gray-400 hover:text-primary hover:cursor-pointer transition-all duration-200 p-2"
    >
      <X className="h-5 w-5" />
    </button>
  );
};

export default XButton;
