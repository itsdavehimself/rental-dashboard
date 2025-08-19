import { Ellipsis, PackagePlus, SquarePen } from "lucide-react";
import { useNavigate } from "react-router";
import type { InventoryListItem } from "../../../types/InventoryItem";
import React, { useState, useEffect } from "react";
import PopOver from "../../../components/common/PopOver";

interface InventoryCardProps<T extends string | null> {
  item: InventoryListItem;
  isLast: boolean;
  columnTemplate: string;
  gap: number;
  setOpenModal: React.Dispatch<React.SetStateAction<T>>;
  setSelectedItem: React.Dispatch<
    React.SetStateAction<{
      uid: string;
      name: string;
    } | null>
  >;
}

const InventoryCard = <T extends string | null>({
  item,
  isLast,
  columnTemplate,
  gap,
  setOpenModal,
  setSelectedItem,
}: InventoryCardProps<T>) => {
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
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPopoverOpen((prev) => !prev);
          }}
          className="p-2 text-gray-400 hover:text-primary hover:cursor-pointer"
        >
          <Ellipsis className="h-5 w-5" />
        </button>
        <div className="relative pointer-events-auto z-50">
          {popoverOpen && (
            <div className="absolute top-full right-4 -mt-1.5 z-50">
              <PopOver
                buttons={[
                  {
                    icon: PackagePlus,
                    label: "Add Stock",
                    onClick: (e) => {
                      e.stopPropagation();
                      setPopoverOpen(false);
                      setSelectedItem({ uid: item.uid, name: item.sku });
                      setOpenModal("addStock" as T);
                    },
                  },
                  {
                    icon: SquarePen,
                    label: "Edit Item",
                    onClick: (e) => {
                      e.stopPropagation();
                      setPopoverOpen(false);
                      setOpenModal("editItem" as T);
                    },
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;
