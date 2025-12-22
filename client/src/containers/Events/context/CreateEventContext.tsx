import React, { createContext } from "react";
import type { ClientDetail } from "../../Clients/types/Client";
import type { EventLineItem } from "../CreateEvent/CreateEvent";
import type { CreateEventModalType } from "../CreateEvent/CreateEvent";
import type { AddressEntry } from "../../../types/Address";
import type { Transaction } from "../types/Event";

export interface CreateEventContextType {
  client: ClientDetail | null;
  setClient: React.Dispatch<React.SetStateAction<ClientDetail | null>>;
  selectedItems: EventLineItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<EventLineItem[]>>;
  openModal: CreateEventModalType;
  setOpenModal: React.Dispatch<React.SetStateAction<CreateEventModalType>>;
  eventBilling: AddressEntry | null;
  setEventBilling: React.Dispatch<React.SetStateAction<AddressEntry | null>>;
  eventDelivery: AddressEntry | null;
  setEventDelivery: React.Dispatch<React.SetStateAction<AddressEntry | null>>;
  eventUid: string | null;
  setEventUid: React.Dispatch<React.SetStateAction<string | null>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  subTotal: number;
  discounts: number;
  taxes: number;
  total: number;
  amountDue: number;
  totalPayments: number;
  taxRate: number;
  setTaxRate: React.Dispatch<React.SetStateAction<number>>;
  clearContext: () => void;
}

export const CreateEventContext = createContext<
  CreateEventContextType | undefined
>(undefined);
