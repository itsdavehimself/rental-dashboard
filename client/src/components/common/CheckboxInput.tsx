import CheckboxOption from "./CheckboxOption";

interface CheckboxInputProps {
  label: string;
  options: { label: string; value: string }[];
  selection: string[];
  onClick: (val: string) => void;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  options,
  selection,
  onClick,
}) => {
  return (
    <div className="flex flex-col gap-1 pb-2">
      <label className="text-sm font-semibold">{label}</label>
      <div className="flex gap-8 mt-1">
        {options.map((option, i) => (
          <CheckboxOption
            key={i}
            label={option.label}
            value={option.value}
            selected={selection.includes(option.value)}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default CheckboxInput;
