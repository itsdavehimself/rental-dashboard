import { useState, useRef } from "react";
import { Edit2, Trash2, EllipsisVertical } from "lucide-react";
import PopOver from "../../../components/common/PopOver";

interface ConfigListItemProps {
  item: { id: number; label: string; skuCode?: string };
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ConfigListItem: React.FC<ConfigListItemProps> = ({
  item,
  isActive,
  onClick,
  onEdit,
  onDelete,
}) => {
  const [popOverOpen, setPopOverOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <div
      onClick={onClick}
      className={`flex justify-between items-center text-sm p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
        isActive ? "bg-blue-50 border-blue-200" : ""
      }`}
    >
      <div className="flex flex-col">
        <span className="font-medium text-gray-800">{item.label}</span>
        {item.skuCode && (
          <span className="text-xs text-gray-500">SKU: {item.skuCode}</span>
        )}
      </div>

      <div className="flex gap-2 relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!buttonRef.current) return;
            setAnchorRect(buttonRef.current.getBoundingClientRect());
            setPopOverOpen(!popOverOpen);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          ref={buttonRef}
          className="p-1 text-gray-400 hover:text-primary transition-all duration-200 hover:cursor-pointer"
        >
          <EllipsisVertical className="h-4 w-4" />
        </button>

        {popOverOpen && anchorRect && (
          <PopOver
            anchorRect={anchorRect}
            onClose={() => setPopOverOpen(false)}
            buttons={[
              {
                icon: Edit2,
                label: "Edit",
                onClick: onEdit,
              },
              {
                icon: Trash2,
                label: "Delete",
                danger: true,
                onClick: onDelete,
              },
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default ConfigListItem;
