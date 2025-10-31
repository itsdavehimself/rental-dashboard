import { Check } from "lucide-react";

interface CheckboxOptionProps {
  label: string;
  value: string;
  selected: boolean;
  onClick: (val: string) => void;
}

const CheckboxOption: React.FC<CheckboxOptionProps> = ({
  label,
  value,
  selected,
  onClick,
}) => {
  return (
    <div
      className="flex items-center gap-2 hover:cursor-pointer"
      onClick={() => onClick(value)}
    >
      <div
        className={`flex justify-center items-center w-4 h-4 rounded-sm ring-2 hover:ring-primary transition-all duration-200 ${
          selected ? "bg-black text-white ring-black" : "ring-gray-300"
        } transition-all duration-200`}
      >
        {selected && <Check className="w-3 h-3" />}
      </div>
      <div className="text-sm">{label}</div>
    </div>
  );
};

export default CheckboxOption;
