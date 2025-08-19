import type { LucideIcon } from "lucide-react";

interface PopOverProps {
  buttons: { icon: LucideIcon; label: string; onClick?: (e) => void }[];
}

const PopOver: React.FC<PopOverProps> = ({ buttons }) => {
  return (
    <div className="shadow-md rounded-xl bg-white border-1 border-gray-200 overflow-hidden">
      {buttons.map((b, i) => (
        <button
          key={i}
          onClick={b.onClick}
          className="grid grid-cols-[1.2rem_1fr] items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 w-full text-left hover:cursor-pointer whitespace-nowrap hover:text-primary transition-all duration-200"
        >
          <b.icon className="h-4 w-4" />
          {b.label}
        </button>
      ))}
    </div>
  );
};

export default PopOver;
