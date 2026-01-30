import React, { createContext } from "react";
import type { EventLineItem } from "../CreateEvent/CreateEvent";
import type { Transaction } from "../types/Event";
import type { AddressEntry } from "../../../types/Address";

export interface BillingContextType {
  eventUid: string | null;
  discounts: number;
  subTotal: number;
  taxes: number;
  total: number;
  totalPayments: number;
  amountDue: number;
  taxRate: number;
  selectedItems: EventLineItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<EventLineItem[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  clearContext: () => void;
  eventBilling: AddressEntry;
  setEventBilling: React.Dispatch<React.SetStateAction<AddressEntry>>;
}

export const BillingContext = createContext<BillingContextType | undefined>(
  undefined,
);
