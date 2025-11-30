import type { ItemBasics } from "../CreateEvent/CreateEvent";

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
  payments: Payment[];
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

type PaymentMethod =
  | "Cash"
  | "CreditCard"
  | "DebitCard"
  | "Zelle"
  | "Check"
  | "BankTransfer"
  | "Square"
  | "Stripe"
  | "Venmo"
  | "PayPal";

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

export type Payment = {
  uid: string;
  eventUid: string;
  amount: number;
  method: PaymentMethod;
  receivedAt: Date;
  transactionId?: string;
  refunded: boolean;
  refundedAmount: number;
  refundedAt?: string;
  refundReason?: string;
  notes?: string;
  collectedBy: string;
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
