import React from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface ValidatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegisterReturn;
  error?: FieldError;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  register,
  error,
  ...rest
}) => {
  return (
    <input
      {...register}
      {...rest}
      className={`ring-1 w-full rounded-lg h-10 pl-2 transition-all duration-200 outline-0 text-sm
        ${
          error
            ? "ring-red-500 focus:ring-red-500"
            : "ring-gray-200 hover:ring-black focus:ring-primary focus:ring-1"
        } ${rest.className ?? ""}`}
    />
  );
};

export default ValidatedInput;
