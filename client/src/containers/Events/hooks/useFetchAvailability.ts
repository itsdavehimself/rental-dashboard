import { useEffect, useMemo } from "react";
import { checkAvailability } from "../../Inventory/services/inventoryService";
import type { EventLineItem } from "../CreateEvent/CreateEvent";

export const useFetchAvailability = (
  apiUrl: string,
  selectedItems: EventLineItem[],
  deliveryDate: Date | null,
  deliveryTime: string | null,
  pickUpDate: Date | null,
  pickUpTime: string | null,
  setSelectedItems: React.Dispatch<React.SetStateAction<EventLineItem[]>>
) => {
  const selectedUids = useMemo(
    () => selectedItems.map((i) => i.uid).join(","),
    [selectedItems]
  );

  const selectedQuantities = useMemo(
    () => selectedItems.map((i) => i.count).join(","),
    [selectedItems]
  );

  useEffect(() => {
    if (
      selectedItems.length === 0 ||
      !deliveryDate ||
      !deliveryTime ||
      !pickUpDate ||
      !pickUpTime
    )
      return;

    const fetchAvailability = async () => {
      try {
        const itemAvailability = await checkAvailability(
          apiUrl,
          selectedItems.map((i) => i.uid),
          deliveryDate,
          deliveryTime,
          pickUpDate,
          pickUpTime
        );

        setSelectedItems((prev) =>
          prev.map((item) => {
            const match = itemAvailability.find((a) => a.uid === item.uid);
            if (!match) return item;

            return {
              ...item,
              quantityAvailable: match.availableQuantity - item.count,
              availabilityChecked: true,
            };
          })
        );
      } catch (err) {
        console.error("Error checking availability:", err);
      }
    };

    fetchAvailability();
  }, [
    apiUrl,
    selectedUids,
    selectedQuantities,
    deliveryDate,
    deliveryTime,
    pickUpDate,
    pickUpTime,
    setSelectedItems,
  ]);
};
