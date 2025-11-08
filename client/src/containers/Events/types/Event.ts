import type { ItemBasics } from "../CreateEvent/CreateEvent";

type Event = {
  uid: string;
  clientUid: string;
  clientName: string;
  businessName?: string;
  clientPhone: string;
  clientEmail: string;
  eventName?: string;
  eventStart: string;
  eventEnd: string;
  billingName: string;
  billingAddressLine1: string;
  billingAddressLine2?: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  deliveryName: string;
  deliveryAddressLine1: string;
  deliveryAddressLine2?: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  status: EventStatus;
  notes?: string;
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
  id: number;
  eventId: number;
  inventoryItemId?: number;
  packageId?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  type: ItemType;
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

type Payment = {
  id: number;
  uid: string;
  eventId: number;
  amount: number;
  method: PaymentMethod;
  receivedAt: string;
  transactionId?: string;
  refunded: boolean;
  refundedAmount: number;
  refundedAt?: string;
  refundReason?: string;
};

type EventDiscount = {
  id: number;
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

export type { Event, EventDiscount, EventDraft, EventItem, EventStatus };
