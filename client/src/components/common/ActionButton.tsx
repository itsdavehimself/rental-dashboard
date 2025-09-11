import { type LucideIcon } from "lucide-react";

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  style: "outline" | "filled";
  full?: boolean;
  icon?: LucideIcon;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  style,
  full,
  icon: Icon,
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`${
        style === "filled"
          ? "bg-primary text-white ring-1 ring-primary hover:bg-primary-hover"
          : "bg-white text-primary hover:bg-gray-50"
      } ${
        full ? "w-full" : "w-fit"
      } justify-center ring-1 ring-primary rounded-lg h-10 px-4 font-semibold text-sm hover:cursor-pointer transition-all duration-200 flex items-center gap-2`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
};

export default ActionButton;
