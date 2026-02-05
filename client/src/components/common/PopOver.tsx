import { createPortal } from "react-dom";
import type { LucideIcon } from "lucide-react";

interface PopOverProps {
  buttons: {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
    danger?: boolean;
  }[];
  anchorRect: DOMRect;
  onClose: () => void;
}

const PopOver: React.FC<PopOverProps> = ({ buttons, anchorRect, onClose }) => {
  return createPortal(
    <div
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="fixed z-50"
      style={{
        top: anchorRect.bottom + 8,
        left: anchorRect.right,
        transform: "translateX(-100%)",
      }}
    >
      <div className="shadow-md rounded-xl bg-white border border-gray-200 overflow-hidden min-w-[120px]">
        {buttons.map((b, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              b.onClick?.();
              onClose();
            }}
            className={`
              grid grid-cols-[1.2rem_auto] items-center gap-2 px-4 py-2 text-sm w-full text-left hover:cursor-pointer transition whitespace-nowrap
              ${
                b.danger
                  ? "text-red-500 hover:bg-red-50 hover:text-red-600"
                  : "text-gray-500 hover:bg-gray-100 hover:text-primary"
              }
            `}
          >
            <b.icon className="h-4 w-4" />
            {b.label}
          </button>
        ))}
      </div>
    </div>,
    document.getElementById("portal-root")!,
  );
};

export default PopOver;
