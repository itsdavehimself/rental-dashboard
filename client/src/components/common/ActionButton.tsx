import React, { forwardRef } from "react";
import { type LucideIcon } from "lucide-react";

interface ActionButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseDown?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style: "outline" | "filled";
  full?: boolean;
  icon?: LucideIcon;
  disabled?: boolean;
  type?: "delete";
}

const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    { label, onClick, onMouseDown, style, full, icon: Icon, disabled, type },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={onClick}
        onMouseDown={onMouseDown}
        className={`
          ${full ? "w-full" : "w-fit"}
          h-10 px-4 rounded-lg font-semibold text-sm transition-all duration-200
          flex items-center justify-center gap-2
          ${disabled ? "cursor-default pointer-events-none" : "hover:cursor-pointer"}
          
          ${
            style === "filled"
              ? disabled
                ? "bg-gray-400 text-white ring-gray-400 ring-1"
                : type === "delete"
                  ? "bg-red-500 text-white ring-1 ring-red-500 hover:bg-red-600"
                  : "bg-primary text-white ring-1 ring-primary hover:bg-primary-hover"
              : disabled
                ? "bg-white text-gray-300 ring-1 ring-gray-300"
                : type === "delete"
                  ? "bg-white text-red-500 ring-1 ring-red-500 hover:bg-red-50"
                  : "bg-white text-primary ring-1 ring-gray-300 hover:ring-primary hover:bg-gray-50"
          }
        `}
      >
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </button>
    );
  },
);

ActionButton.displayName = "ActionButton";

export default ActionButton;
