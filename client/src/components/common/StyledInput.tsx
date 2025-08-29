import type { UseFormRegisterReturn } from "react-hook-form";

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  register?: UseFormRegisterReturn;
  label: string;
  placeholder: string;
  type?: string;
  error?: string | undefined;
  optional?: boolean;
  disabled?: boolean;
  defaultText?: string;
}

const StyledInput: React.FC<StyledInputProps> = ({
  label,
  register,
  placeholder,
  type = "text",
  error,
  optional,
  disabled,
  defaultText,
  ...rest
}) => {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">
          {label}{" "}
          {optional && (
            <span className="font-normal text-gray-400">(optional)</span>
          )}
        </label>
        <input
          {...register}
          {...rest}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          defaultValue={defaultText}
          className={`text-sm outline-1 w-full rounded-lg h-10 pl-2 transition-all duration-200 outline-gray-200 ${
            error
              ? "outline-red-500 hover:outline-red-500 focus:outline-red-500"
              : !disabled
              ? "hover:outline-black focus:outline-primary focus:outline-1"
              : ""
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-sm pt-1">{error}</p>}
    </div>
  );
};

export default StyledInput;
