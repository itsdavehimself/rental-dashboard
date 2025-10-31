import React, { useState, useEffect } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface QuantityInputProps {
  register?: UseFormRegisterReturn;
  value?: number;
  onValueChange: (value: number) => void;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  value = 1,
  onValueChange,
  register,
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    const digitsOnly = rawValue.replace(/\D/g, "");
    const newValue = parseInt(digitsOnly || "0", 10);
    onValueChange(newValue);

    if (register) {
      register.onChange({
        target: {
          name: register.name,
          value: newValue,
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <input
        {...rest}
        {...register}
        type="text"
        inputMode="decimal"
        value={displayValue}
        onChange={handleChange}
        className="text-sm outline-1 w-full rounded-lg h-10 pl-2 transition-all duration-200 outline-gray-200 hover:outline-black focus:outline-primary focus:outline-1"
      />
    </div>
  );
};

export default QuantityInput;
