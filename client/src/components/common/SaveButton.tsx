import type { LucideIcon } from "lucide-react";

interface SaveButtonProps {
  label?: string;
  action: () => void;
  disabled?: boolean;
  Icon?: LucideIcon;
}

const SaveButton: React.FC<SaveButtonProps> = ({
  label = "Save",
  action,
  disabled,
  Icon,
}) => {
  return (
    <button
      onClick={action}
      className={`${
        disabled
          ? "bg-gray-400 text-white ring-gray-400 hover:cursor-default"
          : "bg-primary text-white ring-primary hover:cursor-pointer hover:bg-primary-hover"
      } flex justify-center items-center text-sm ring-1 w-fit rounded-lg h-10 font-semibold transition-all duration-200`}
    >
      <div className="flex gap-2 justify-center items-center px-4">
        {Icon && <Icon className="w-4 h-4" />}
        <p>{label}</p>
      </div>
    </button>
  );
};

export default SaveButton;
