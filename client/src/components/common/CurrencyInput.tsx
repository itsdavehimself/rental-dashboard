import React, { useState, useEffect } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface CurrencyInputProps {
  register?: UseFormRegisterReturn;
  label: string;
  value?: number;
  onValueChange: (value: number) => void;
}

const CurrencyInput: React.FC<CurrencyInputProps> = ({
  label,
  value = 0,
  onValueChange,
  register,
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    const formattedValue = currencyFormatter.format(value / 100);
    setDisplayValue(formattedValue);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    const digitsOnly = rawValue.replace(/\D/g, "");
    const newValueInCents = parseInt(digitsOnly || "0", 10);
    onValueChange(newValueInCents);

    if (register) {
      register.onChange({
        target: {
          name: register.name,
          value: newValueInCents,
        },
      });
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">{label}</label>
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

export default CurrencyInput;
