import type { EventLineItem } from "../CreateEvent";
import QuantityInput from "../../../../components/common/QuantityInput";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import ChipTag from "../../../../components/common/ChipTag";

interface SelectedItemRowProps {
  item: EventLineItem;
  selectedItems: EventLineItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<EventLineItem[]>>;
}

const SelectedItemRow: React.FC<SelectedItemRowProps> = ({
  item,
  selectedItems,
  setSelectedItems,
}) => {
  const [itemSubtotal, setItemSubtotal] = useState<number>(item.unitPrice);
  const handleQuantityChange = (uid: string, newQuantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.uid === uid ? { ...item, count: newQuantity } : item,
      ),
    );
  };

  const q = item.quantityAvailable;
  const color = q > 0 ? "green" : q < 0 ? "red" : "gray";

  const label =
    q > 0 ? `${q} available` : q < 0 ? `${Math.abs(q)} short` : `0 available`;

  useEffect(() => {
    setItemSubtotal(item.count * item.unitPrice);
  }, [item.count]);

  return (
    <div className="flex flex-row justify-between items-center px-4 h-20 text-sm text-primary">
      <div className="grid grid-cols-[4rem_1fr] items-center">
        <div className="bg-gray-200 rounded-lg h-12 w-12 overflow-hidden flex-shrink-0">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.description}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gray-200" />
          )}
        </div>
        <div className="flex flex-col">
          <p className="font-semibold">{item.description}</p>
          <p className="text-xs text-gray-500">{item.sku}</p>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_80px_50px_60px_30px] items-center gap-4">
        <div className="flex justify-center items-center">
          {item.availabilityChecked && <ChipTag label={label} color={color} />}
        </div>
        <div className="text-right font-semibold">${item.unitPrice}/unit</div>
        <QuantityInput
          value={item.count}
          onValueChange={(val) => handleQuantityChange(item.uid, val)}
        />
        <div className="flex justify-center items-center font-semibold">
          ${itemSubtotal.toFixed(2)}
        </div>
        <button
          onClick={() => {
            const filteredArr = selectedItems.filter((i) => i.sku !== item.sku);
            setSelectedItems(filteredArr);
          }}
          className="flex p-1 justify-center items-center text-gray-400 hover:text-primary hover:cursor-pointer transition-all duration-200"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SelectedItemRow;
