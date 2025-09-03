import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";

interface LinkButtonProps {
  label: string;
  Icon?: LucideIcon;
  to: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ Icon, label, to }) => {
  return (
    <Link
      to={to}
      className="flex justify-center items-center bg-primary text-sm text-white ring-1 ring-primary w-fit rounded-lg h-10 font-semibold hover:cursor-pointer hover:bg-primary-hover transition-all duration-200"
    >
      <div className="flex gap-2 justify-center items-center px-4">
        {Icon && <Icon className="w-4 h-4" />}
        <p>{label}</p>
      </div>
    </Link>
  );
};

export default LinkButton;
