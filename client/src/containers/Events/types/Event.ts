import type { ItemBasics } from "../CreateEvent/CreateEvent";
import type { PaymentMethod } from "./PaymentType";

type Event = {
  uid: string;
  clientUid: string;
  clientFirstName: string;
  clientLastName: string;
  businessName?: string;
  clientPhone: string;
  clientEmail: string;
  eventName?: string;
  eventStart: string;
  eventEnd: string;
  billingAddressEntryUid: string;
  billingFirstName: string;
  billingLastName: string;
  billingAddressLine1: string;
  billingAddressLine2?: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingPhone: string;
  billingEmail: string;
  deliveryAddressEntryUid: string;
  deliveryFirstName: string;
  deliveryLastName: string;
  deliveryAddressLine1: string;
  deliveryAddressLine2?: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryPhone: string;
  deliveryEmail: string;
  status: EventStatus;
  notes?: string;
  eventType: string;
  internalNotes?: string;
  logisticsTasks: LogisticsTask[];
  items: EventItem[];
  subtotal: number;
  taxAmount: number;
  discounts: EventDiscount[];
  total: number;
  transactions: Transaction[];
  createdAt: string;
  updatedAt: string;
};

type EventStatus =
  | "Draft"
  | "Confirmed"
  | "Scheduled"
  | "Completed"
  | "Cancelled";

type ItemType = "AlaCarte" | "Package";

type LogisticsTaskType = "Delivery" | "Pickup" | "Setup" | "Teardown";

type DiscountType = "FlatAmount" | "Percentage";

type EventItem = {
  uid: string;
  inventoryItemUid: string;
  description: string;
  unitPrice: number;
  type: string;
  packageUid: string;
  quantity: number;
  inventoryItemSKU: string;
  createdAt: string;
  updatedAt: string;
};

type LogisticsTask = {
  id: number;
  uid: string;
  eventId: number;
  type: LogisticsTaskType;
  startTime: string;
  endTime: string;
  crewLeadId?: number;
  notes?: string;
};

type TransactionType = "Payment" | "Refund" | "Adjustment";

export type Transaction = {
  uid: string;
  eventUid: number;
  amount: number;
  type: TransactionType;
  method: PaymentMethod;
  occurredAt: string;
  externalTransactionId?: string;
  relatedTransactionUid?: string;
  processedBy?: string;
  notes?: string;
  cardBrand: string;
  last4: string;
};

type EventDiscount = {
  uid: string;
  eventId: number;
  type: DiscountType;
  amount: number;
  reason?: string;
  createdAt: string;
};

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

type EventDraftResponse = {
  uid: string;
  status: string;
  clientName: string;
  total: number;
};

export type {
  Event,
  EventDiscount,
  EventDraft,
  EventItem,
  EventStatus,
  EventDraftResponse,
};
