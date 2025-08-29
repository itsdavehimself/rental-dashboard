import { useNavigate } from "react-router";
import type { InventoryListItem } from "../../../../types/InventoryItem";
import { useState, useEffect } from "react";

interface EventRowProps {
  item: InventoryListItem;
  isLast: boolean;
  columnTemplate: string;
  gap: number;
}

const EventRow = ({ item, isLast, columnTemplate, gap }: EventRowProps) => {
  const navigate = useNavigate();
  const formatPrice = (price: number): string => {
    const formattedPrice = price.toFixed(2);
    return `$${formattedPrice}`;
  };

  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = () => setPopoverOpen(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      onClick={(e) => {
        if (popoverOpen) {
          e.stopPropagation();
          setPopoverOpen(false);
          return;
        }
        navigate(`${item.uid}`);
      }}
      className={`relative grid ${columnTemplate} items-center w-full gap-${gap} px-8 py-4 text-sm transition-all duration-200
    ${isLast ? "rounded-b-xl" : "border-b border-gray-200"}
    ${popoverOpen ? "" : "hover:bg-gray-50 hover:cursor-pointer"}
  `}
    >
      <p>{item.sku}</p>
      <p>{item.description} </p>
      <p className="text-right">{item.quantityTotal}</p>
      <p className="text-right">
        {item.unitPrice && formatPrice(item.unitPrice)}
      </p>
    </div>
  );
};

export default EventRow;
