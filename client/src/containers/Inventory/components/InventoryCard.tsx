import { Ellipsis } from "lucide-react";
import { useNavigate } from "react-router";
import type { ListInventoryItem } from "../../../types/InventoryItem";

interface InventoryCardProps {
  item: ListInventoryItem;
  isLast: boolean;
  columnTemplate: string;
  gap: number;
}

const InventoryCard: React.FC<InventoryCardProps> = ({
  item,
  isLast,
  columnTemplate,
  gap,
}) => {
  const navigate = useNavigate();
  const formatPrice = (price: number): string => {
    const formattedPrice = price.toFixed(2);
    return `$${formattedPrice}`;
  };
  return (
    <div
      className={`grid ${columnTemplate} items-center w-full gap-${gap} px-8 py-4 text-sm hover:bg-gray-50 hover:cursor-pointer transition-all duration-200 ${
        isLast ? "rounded-b-xl" : "border-b border-gray-200"
      }`}
      onClick={() => navigate(`${item.uid}`)}
    >
      <p>{item.sku}</p>
      <p>{item.description} </p>
      <p className="text-right">{item.quantityTotal}</p>
      <p className="text-right">
        {item.unitPrice && formatPrice(item.unitPrice)}
      </p>
      <button className="flex justify-center text-gray-400 items-center w-full hover:cursor-pointer hover:text-primary transition-all duration-200">
        <Ellipsis className="h-5 w-5" />
      </button>
    </div>
  );
};

export default InventoryCard;
