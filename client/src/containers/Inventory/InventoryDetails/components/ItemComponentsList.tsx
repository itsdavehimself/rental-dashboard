import { Plus, Trash2 } from "lucide-react";
import ActionButton from "../../../../components/common/ActionButton";
import type { InventoryItemComponent } from "../../types/InventoryItem";

interface Props {
  components: InventoryItemComponent[];
  onAddClick: () => void;
  onRemoveClick: (componentId: number) => void;
}

const ItemComponentsList: React.FC<Props> = ({
  components,
  onAddClick,
  onRemoveClick,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col gap-4 w-full h-full min-h-0">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Included Components
        </h3>
        <ActionButton
          label="Add Component"
          icon={Plus}
          style="outline"
          onClick={onAddClick}
        />
      </div>
      <div className="flex flex-col gap-2 mt-2 min-h-0 overflow-y-auto pr-1">
        {components.length === 0 ? (
          <div className="flex flex-col justify-center items-center text-sm text-gray-400">
            <p>No components linked.</p>
            <p>Add required hardware or accessories here.</p>
          </div>
        ) : (
          components.map((comp) => (
            <div
              key={comp.id}
              className="flex justify-between items-center p-3 hover:bg-gray-50 border border-gray-100 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center bg-gray-100 text-gray-700 font-bold w-10 h-10 rounded-lg">
                  {comp.quantity}x
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800">
                    {comp.description}
                  </span>
                  <div className="flex gap-2 items-center mt-0.5">
                    <span className="text-xs text-gray-500 font-mono">
                      SKU: {comp.sku}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${comp.isRequired ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-600"}`}
                    >
                      {comp.isRequired ? "Required" : "Optional"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onRemoveClick(comp.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ItemComponentsList;
