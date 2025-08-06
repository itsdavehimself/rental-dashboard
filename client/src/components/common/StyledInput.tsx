import type { UseFormRegisterReturn } from "react-hook-form";

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn;
  label: string;
  placeholder: string;
}

const StyledInput: React.FC<StyledInputProps> = ({
  label,
  register,
  placeholder,
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">{label}</label>
      <input
        {...register}
        {...rest}
        placeholder={placeholder}
        className={`text-sm outline-1 w-full rounded-lg h-10 pl-2 transition-all duration-200 outline-gray-200 hover:outline-black focus:outline-primary focus:outline-1`}
      />
    </div>
  );
};

export default StyledInput;
