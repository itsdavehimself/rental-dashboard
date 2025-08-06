import { X } from "lucide-react";

interface XButtonProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const XButton: React.FC<XButtonProps> = ({ setIsModalOpen }) => {
  return (
    <button
      onClick={() => setIsModalOpen(false)}
      className="text-gray-400 hover:text-primary hover:cursor-pointer transition-all duration-200 p-2"
    >
      <X className="h-5 w-5" />
    </button>
  );
};

export default XButton;
