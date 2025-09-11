import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";

interface LinkButtonProps {
  label: string;
  Icon?: LucideIcon;
  to: string;
  disabled?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  Icon,
  label,
  to,
  disabled,
}) => {
  return (
    <Link
      to={disabled ? "#" : to}
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
    </Link>
  );
};

export default LinkButton;
