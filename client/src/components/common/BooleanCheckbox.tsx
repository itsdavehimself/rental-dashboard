import { Check } from "lucide-react";

interface BooleanCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

const BooleanCheckbox: React.FC<BooleanCheckboxProps> = ({
  label,
  checked,
  onChange,
}) => {
  return (
    <div
      className="flex items-center gap-2 hover:cursor-pointer w-fit"
      onClick={() => onChange(!checked)}
    >
      <div
        className={`flex justify-center items-center w-4 h-4 rounded-sm ring-2 hover:ring-primary transition-all duration-200 ${
          checked ? "bg-black text-white ring-black" : "ring-gray-300"
        }`}
      >
        {checked && <Check className="w-3 h-3" />}
      </div>
      <div className="text-sm">{label}</div>
    </div>
  );
};

export default BooleanCheckbox;
