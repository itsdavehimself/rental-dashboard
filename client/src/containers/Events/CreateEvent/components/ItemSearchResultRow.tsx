import type { InventoryItemSearchResult } from "../../../Inventory/types/InventoryItem";
import type { EventItem } from "../CreateEvent";

interface ItemSearchResultRowProps {
  item: InventoryItemSearchResult;
  selectedItems: EventItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<EventItem[]>>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const ItemSearchResultRow: React.FC<ItemSearchResultRowProps> = ({
  item,
  setSelectedItems,
  setQuery,
}) => {
  return (
    <div
      onClick={() => {
        setSelectedItems((prev) => {
          const alreadyExists = prev.some((i) => i.uid === item.uid);
          if (alreadyExists) return prev;

          return [
            ...prev,
            {
              uid: item.uid,
              description: item.description,
              sku: item.sku,
              count: 1,
              unitPrice: item.unitPrice,
              quantityAvailable: 0,
              availabilityChecked: false,
            },
          ];
        });
        setQuery("");
      }}
      key={item.uid}
      className="grid grid-cols-[1fr_.2fr] items-center px-4 h-20 text-sm text-gray-500 hover:text-primary hover:bg-gray-50 hover:cursor-pointer"
    >
      <div className="grid grid-cols-[4rem_1fr] items-center">
        <div className="bg-gray-200 rounded-lg h-12 w-12"></div>
        <div className="flex flex-col">
          <p className="font-semibold">{item.description}</p>
          <p className="text-xs text-gray-500">{item.sku}</p>
        </div>
      </div>
      <div className="text-right font-semibold">${item.unitPrice}/unit</div>
    </div>
  );
};

export default ItemSearchResultRow;
