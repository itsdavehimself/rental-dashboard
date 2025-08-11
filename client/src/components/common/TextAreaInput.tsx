import type { UseFormRegisterReturn } from "react-hook-form";

interface TextAreaInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  register?: UseFormRegisterReturn;
  label: string;
  placeholder?: string;
  optional: boolean;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  label,
  register,
  optional,
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">
        {label}{" "}
        {optional && (
          <span className="font-normal text-gray-400">(optional)</span>
        )}
      </label>
      <textarea
        {...register}
        {...rest}
        className="text-sm outline-1 w-full rounded-lg h-24 pl-2 pt-2 resize-none transition-all duration-200 outline-gray-200 hover:outline-black focus:outline-primary focus:outline-1"
      />
    </div>
  );
};

export default TextAreaInput;
