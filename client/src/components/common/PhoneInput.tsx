import React, { useState, useEffect } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

const formatPhoneNumber = (value: string) => {
  if (!value) return "";
  const phoneNumber = value.replace(/[^\d]/g, "");
  const part1 = phoneNumber.slice(0, 3);
  const part2 = phoneNumber.slice(3, 6);
  const part3 = phoneNumber.slice(6, 10);

  if (part3) {
    return `${part1}-${part2}-${part3}`;
  }
  if (part2) {
    return `${part1}-${part2}`;
  }
  return part1;
};

interface PhoneInputProps {
  register?: UseFormRegisterReturn;
  label: string;
  value?: string;
  error: string | undefined;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  value = "",
  register,
  error,
  ...rest
}) => {
  const [displayValue, setDisplayValue] = useState("");

  useEffect(() => {
    const formattedValue = formatPhoneNumber(value);
    setDisplayValue(formattedValue);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, "").slice(0, 10);
    const formattedForDisplay = formatPhoneNumber(digitsOnly);

    setDisplayValue(formattedForDisplay);

    if (register) {
      register.onChange({
        target: {
          name: register.name,
          value: formattedForDisplay,
        },
      });
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-semibold">{label}</label>
        <input
          {...rest}
          {...register}
          type="tel"
          inputMode="tel"
          value={displayValue}
          onChange={handleChange}
          placeholder="847-555-1337"
          maxLength={12}
          className={`text-sm outline-1 w-full rounded-lg h-10 pl-2 transition-all duration-200 outline-gray-200 hover:outline-black focus:outline-primary focus:outline-1 ${
            error
              ? "outline-red-500 hover:outline-red-500 focus:outline-red-500"
              : ""
          }`}
        />
      </div>
      {error && <p className="text-red-500 text-sm pt-1">{error}</p>}
    </div>
  );
};

export default PhoneInput;
