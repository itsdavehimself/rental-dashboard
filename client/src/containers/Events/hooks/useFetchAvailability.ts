import { useEffect, useRef } from "react";
import { checkAvailability } from "../../Inventory/services/inventoryService";
import type { EventLineItem } from "../CreateEvent/CreateEvent";

export const useFetchAvailability = (
  apiUrl: string,
  selectedItems: EventLineItem[],
  deliveryDate: Date | null,
  deliveryTime: string | null,
  pickUpDate: Date | null,
  pickUpTime: string | null,
  setSelectedItems: React.Dispatch<React.SetStateAction<EventLineItem[]>>,
  eventUid: string | null,
) => {
  const lastCheckedRef = useRef("");

  useEffect(() => {
    const timeRegex = /^\d{1,2}:\d{2}(am|pm)$/;
    if (
      !deliveryDate ||
      !pickUpDate ||
      !timeRegex.test(deliveryTime || "") ||
      !timeRegex.test(pickUpTime || "")
    )
      return;
    if (selectedItems.length === 0) return;

    const currentCheckKey = JSON.stringify({
      ids: selectedItems.map((i) => i.uid).sort(),
      counts: selectedItems.map((i) => i.count).sort(),
      dates: { deliveryDate, deliveryTime, pickUpDate, pickUpTime },
    });

    if (lastCheckedRef.current === currentCheckKey) return;

    const handler = setTimeout(async () => {
      try {
        if (!deliveryTime || !pickUpTime) return;
        const itemAvailability = await checkAvailability(
          apiUrl,
          selectedItems.map((i) => i.uid),
          deliveryDate,
          deliveryTime,
          pickUpDate,
          pickUpTime,
          eventUid,
        );

        lastCheckedRef.current = currentCheckKey;

        setSelectedItems((prev) =>
          prev.map((item) => {
            const match = itemAvailability.find((a) => a.uid === item.uid);
            if (!match) return item;
            return {
              ...item,
              quantityAvailable: match.availableQuantity - item.count,
              availabilityChecked: true,
            };
          }),
        );
      } catch (err) {
        console.error("Error checking availability:", err);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [
    selectedItems,
    deliveryDate,
    deliveryTime,
    pickUpDate,
    pickUpTime,
    eventUid,
    apiUrl,
    setSelectedItems,
  ]);
};
