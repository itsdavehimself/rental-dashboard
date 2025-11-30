import { type EventItem } from "../types/Event";
import { type EventLineItem } from "../CreateEvent/CreateEvent";

export const mapItemResToEvent = (eventItems: EventItem[]): EventLineItem[] => {
  return eventItems.map((i) => ({
    uid: i.inventoryItemUid,
    description: i.description,
    count: i.quantity,
    sku: i.inventoryItemSKU,
    unitPrice: i.unitPrice,
    quantityAvailable: 0,
    availabilityChecked: false,
  }));
};
