import { ChevronDown, ChevronUp, X } from "lucide-react";
import type { RefObject } from "react";
import { useRef } from "react";

interface MultiDropdownProps {
  ref: RefObject<HTMLDivElement | null>;
  openDropdown: string | null;
  setOpenDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  label: string;
  selectedValues: (string | number)[];
  onChange: (vals: (string | number)[]) => void;
  options: { value: string | number; label: string }[];
  error?: string;
  placeholder?: string;
}

const MultiCrewDropdown: React.FC<MultiDropdownProps> = ({
  ref,
  openDropdown,
  setOpenDropdown,
  label,
  selectedValues,
  onChange,
  options,
  error,
  placeholder = "Select Crew Members",
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const isOpen = openDropdown === label;

  const handleSelect = (val: string | number) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((item) => item !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const removeChip = (e: React.MouseEvent, val: string | number) => {
    e.stopPropagation();
    onChange(selectedValues.filter((item) => item !== val));
  };

  return (
    <div ref={ref} className="relative w-full">
      <p className="text-sm font-semibold mb-1">{label}</p>

      <div
        className={`hover:ring-primary text-theme-black ring-1 ring-gray-200 rounded-lg p-1.5 min-h-[42px] mt-0.5 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary hover:cursor-pointer transition duration-200 flex items-center justify-between ${
          error ? "ring-red-500" : ""
        }`}
        tabIndex={0}
        onClick={() => setOpenDropdown(isOpen ? null : label)}
      >
        <div className="flex flex-wrap gap-1 items-center">
          {selectedValues.length === 0 && (
            <span className="text-gray-400 px-1">{placeholder}</span>
          )}
          {selectedValues.map((val) => {
            const option = options.find((o) => o.value === val);
            return (
              <span
                key={val}
                className="bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-md flex items-center gap-1 text-sm font-medium"
              >
                {option?.label}
                <X
                  size={14}
                  className="hover:text-primary cursor-pointer text-gray-500 transition-all duration-200"
                  onClick={(e) => removeChip(e, val)}
                />
              </span>
            );
          })}
        </div>
        <div className="flex-shrink-0 ml-2 px-1">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          className="flex flex-col border bg-white w-full border-gray-300 rounded-lg overflow-hidden absolute mt-1 z-[100] max-h-60 overflow-y-auto shadow-xl"
        >
          {options.length === 0 ? (
            <li className="text-sm text-gray-400 px-3 py-2">
              No other members available
            </li>
          ) : (
            options.map((opt, i) => {
              const isSelected = selectedValues.includes(opt.value);
              return (
                <li
                  key={opt.value}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(opt.value);
                  }}
                  className={`text-sm cursor-pointer px-3 py-2 flex justify-between items-center transition-colors ${
                    isSelected
                      ? "bg-sky-50 text-sky-700 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-sky-700" />
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
      {error && <p className="text-red-500 text-sm pt-1">{error}</p>}
    </div>
  );
};

export default MultiCrewDropdown;
