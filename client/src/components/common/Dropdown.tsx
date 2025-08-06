import { ChevronDown, ChevronUp } from "lucide-react";
import type { RefObject } from "react";

interface DropdownProps {
  ref: RefObject<HTMLDivElement | null>;
  openDropdown: string | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
}

const Dropdown: React.FC<DropdownProps> = ({
  ref,
  openDropdown,
  setOpenDropdown,
  label,
  value,
  onChange,
  options,
}) => {
  return (
    <div ref={ref} className="relative">
      <p className="text-sm font-semibold mb-1">{label}</p>
      <div
        className="hover:ring-primary text-theme-black ring-1 ring-gray-200 rounded-lg p-2 mt-0.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-theme-black hover:cursor-pointer hover:ring-theme-black transition duration-200"
        onClick={() => {
          if (openDropdown === "condition") {
            setOpenDropdown(null);
          } else setOpenDropdown("condition");
        }}
      >
        <div className="flex justify-between items-center">
          <span>{value}</span>
          {openDropdown === "condition" ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {openDropdown === "condition" && (
        <ul className="flex flex-col border-1 bg-white w-full border-gray-300 rounded-lg overflow-hidden absolute mt-0.5">
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpenDropdown(null);
              }}
              className={`text-sm cursor-pointer px-2 py-2 hover:bg-gray-100 transition-colors duration-200 ${
                value === opt.value ? "bg-gray-200 font-semibold" : ""
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
