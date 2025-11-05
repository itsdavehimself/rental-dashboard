import type { ItemBasics } from "../CreateEvent/CreateEvent";

type EventDraft = {
  clientUid: string;
  eventName: string;
  deliveryDate: Date;
  deliveryTime: string;
  pickupDate: Date;
  pickupTime: string;
  billingAddressUid: string;
  deliveryAddressUid: string;
  notes: string;
  internalNotes: string;
  items: ItemBasics[];
};

export type { EventDraft };
