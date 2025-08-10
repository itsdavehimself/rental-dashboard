import { ChevronDown, ChevronUp } from "lucide-react";
import type { RefObject } from "react";
import { useState } from "react";

interface DropdownProps {
  ref: RefObject<HTMLDivElement | null>;
  openDropdown: string | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  label: string;
  value: string | number;
  selectedLabel: string;
  onChange: (val: string | number) => void;
  options: { value: string | number; label: string }[];
  error: string | undefined;
}

const Dropdown: React.FC<DropdownProps> = ({
  ref,
  openDropdown,
  setOpenDropdown,
  label,
  value,
  selectedLabel,
  onChange,
  options,
  error,
}) => {
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (openDropdown === label) {
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          onChange(options[highlightedIndex].value);
          setOpenDropdown(null);
        }
      } else {
        setOpenDropdown(label);
        setHighlightedIndex(Number(value) - 1);
      }
    }

    if (e.key === "Escape") {
      setOpenDropdown(null);
      setHighlightedIndex(-1);
    }

    if (openDropdown === label) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < options.length - 1 ? prev + 1 : 0
        );
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : options.length - 1
        );
      }
    }
  };

  return (
    <div ref={ref} className="relative">
      <p className="text-sm font-semibold mb-1">{label}</p>
      <div
        className={`hover:ring-primary text-theme-black ring-1 ring-gray-200 rounded-lg p-2 mt-0.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary hover:cursor-pointer transition duration-200 ${
          error ? "ring-red-500 hover:ring-red-500 focus:ring-red-500" : ""
        }`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => {
          if (openDropdown === label) {
            setOpenDropdown(null);
          } else setOpenDropdown(label);
        }}
      >
        <div className="flex justify-between items-center">
          <span>{selectedLabel}</span>
          {openDropdown === label ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>
      {openDropdown === label && (
        <ul className="flex flex-col border-1 bg-white w-full border-gray-300 rounded-lg overflow-hidden absolute mt-0.5 z-100">
          {options.map((opt, i) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpenDropdown(null);
              }}
              className={`text-sm cursor-pointer px-2 py-2 hover:bg-gray-100 transition-colors duration-200 ${
                value === opt.value
                  ? "bg-gray-200 font-semibold hover:bg-gray-200"
                  : "hover:bg-gray-100"
              } ${i === highlightedIndex ? "bg-gray-100" : ""}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-red-500 text-sm pt-1">{error}</p>}
    </div>
  );
};

export default Dropdown;
