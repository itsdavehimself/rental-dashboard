import React, { createContext } from "react";
import type { EventLineItem } from "../CreateEvent/CreateEvent";
import type { Transaction } from "../types/Event";

export interface BillingContextType {
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
}

export const BillingContext = createContext<BillingContextType | undefined>(
  undefined,
);
