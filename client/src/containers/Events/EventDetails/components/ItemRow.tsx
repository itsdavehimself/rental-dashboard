import type { EventItem } from "../../types/Event";

interface ItemRowProps {
  item: EventItem;
}
const ItemRow: React.FC<ItemRowProps> = ({ item }) => {
  return (
    <div className="grid grid-cols-[1fr_4rem_4rem_4rem] gap-14 justify-between items-center h-20 text-sm text-primary">
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
          <p className="text-xs text-gray-500">{item.inventoryItemSKU}</p>
        </div>
      </div>
      <div className="items-center">
        <div className="text-right">{item.quantity}</div>
      </div>
      <div className="items-center">
        <div className="text-right">${item.unitPrice}/unit</div>
      </div>
      <div className="items-center">
        <div className="text-right">${item.unitPrice * item.quantity}</div>
      </div>
    </div>
  );
};

export default ItemRow;
