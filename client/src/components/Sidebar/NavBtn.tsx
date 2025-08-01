import type { LucideIcon } from "lucide-react";
import { useLocation } from "react-router";
import { Link } from "react-router";

interface NavBtnProps {
  label: string;
  icon: LucideIcon;
  path: string;
}

const NavBtn: React.FC<NavBtnProps> = ({ label, icon: Icon, path }) => {
  const location = useLocation();
  const currentPath = path === location.pathname;

  return (
    <Link
      to={path}
      className={`grid grid-cols-[2.5rem_2fr] items-center text-sm hover:bg-white hover:shadow-sm hover:cursor-pointer transition-all duration-200 px-4 py-3 rounded-xl font-semibold ${
        currentPath ? "text-black bg-white shadow-sm" : "text-gray-500"
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
};

export default NavBtn;
