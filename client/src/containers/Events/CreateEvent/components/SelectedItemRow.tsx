import type { SelectedItem } from "../CreateEvent";
import QuantityInput from "../../../../components/common/QuantityInput";
import { X } from "lucide-react";

interface SelectedItemRowProps {
  item: SelectedItem;
  selectedItems: SelectedItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
}

const SelectedItemRow: React.FC<SelectedItemRowProps> = ({
  item,
  selectedItems,
  setSelectedItems,
}) => {
  const handleQuantityChange = (uid: string, newQuantity: number) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.uid === uid ? { ...item, quantitySelected: newQuantity } : item
      )
    );
  };
  return (
    <div className="grid grid-cols-[1fr_.2fr] items-center px-4 h-20 text-sm text-primary">
      <div className="grid grid-cols-[4rem_1fr] items-center">
        <div className="bg-gray-200 rounded-lg h-12 w-12"></div>
        <div className="flex flex-col">
          <p className="font-semibold">{item.description}</p>
          <p className="text-xs text-gray-500">{item.sku}</p>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_3rem_2rem] gap-4 items-center">
        <div className="text-right font-semibold">${item.unitPrice}/unit</div>
        <QuantityInput
          value={item.quantitySelected}
          onValueChange={(val) => handleQuantityChange(item.uid, val)}
        />
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
