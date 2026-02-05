import type { ItemBasics } from "../CreateEvent/CreateEvent";
import type { PaymentMethod } from "./PaymentType";

type Event = {
  uid: string;
  clientUid: string;
  clientFirstName: string;
  clientLastName: string;
  businessName: string | null;
  clientPhone: string;
  clientEmail: string;
  eventName: string | null;
  eventStart: string;
  eventEnd: string;
  billingAddressEntryUid: string;
  billingFirstName: string;
  billingLastName: string;
  billingAddressLine1: string;
  billingAddressLine2: string | null;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingPhone: string;
  billingEmail: string;
  deliveryAddressEntryUid: string;
  deliveryFirstName: string;
  deliveryLastName: string;
  deliveryAddressLine1: string;
  deliveryAddressLine2: string | null;
  deliveryCity: string;
  deliveryState: string;
  deliveryZipCode: string;
  deliveryPhone: string;
  deliveryEmail: string;
  status: EventStatus;
  notes: string | null;
  eventType: string;
  internalNotes: string | null;
  logisticsTrips: LogisticsTrip[];
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
  | "On Hold"
  | "Completed"
  | "Cancelled";

type ItemType = "AlaCarte" | "Package";

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

export type LogisticsTrip = {
  uid: string;
  actualArrival: string;
  actualStart: string;
  completedAt: string;
  deliveryDetails: LogisticsTripDeliveryDetails;
  crew: CrewMember[];
  crewLeadName: string;
  scheduledEnd: string;
  scheduledStart: string;
  status: string;
  tripSummary: string;
  truckUid: string;
  truckName: string;
  workItems: WorkItem[];
};

type LogisticsTripDeliveryDetails = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  eventName: string;
  eventUid: string;
};

type CrewMember = {
  fullName: string;
  isLead: boolean;
  roleNotes: string;
  uid: string;
  userUid: string;
};

type WorkItem = {
  completedAt: Date;
  isCompleted: boolean;
  notes: string;
  type: string;
  uid: string;
};

type TransactionType = "Payment" | "Refund" | "Adjustment";

export type Transaction = {
  uid: string;
  eventUid: number;
  amount: number;
  type: TransactionType;
  method: PaymentMethod;
  occurredAt: string;
  externalTransactionId: string | null;
  relatedTransactionUid: string | null;
  processedBy: string | null;
  notes: string | null;
  cardBrand: string;
  last4: string;
};

type EventDiscount = {
  uid: string;
  eventId: number;
  type: DiscountType;
  amount: number;
  reason: string | null;
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
  EventDraftResponse,
  EventStatus,
  WorkItem,
  CrewMember,
};
