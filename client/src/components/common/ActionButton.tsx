import { type LucideIcon } from "lucide-react";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  style: "outline" | "filled";
  full?: boolean;
  icon?: LucideIcon;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  style,
  full,
  icon: Icon,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className={`
        ${
          style === "filled"
            ? disabled
              ? "bg-gray-400 text-white ring-gray-400 ring-1"
              : "bg-primary text-white ring-1 ring-primary hover:bg-primary-hover"
            : disabled
            ? "bg-white text-gray-300 ring-1 ring-gray-300"
            : "bg-white text-primary ring-1 ring-primary hover:bg-gray-50"
        }
        ${full ? "w-full" : "w-fit"}
        h-10 px-4 rounded-lg font-semibold text-sm transition-all duration-200
        flex items-center justify-center gap-2
        ${
          disabled
            ? "cursor-default pointer-events-none"
            : "hover:cursor-pointer"
        }
      `}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
};

export default ActionButton;
