import { createContext } from "react";
import type { Event } from "../types/Event";
import type { AddressEntry } from "../../../types/Address";
import type { ClientDetail } from "../../Clients/types/Client";
import type { LogisticsTrip } from "../types/Event";

export interface EventDetailsContextType {
  fetchedEvent: Event | null;
  loadingEvent: boolean;
  clearContext: () => void;
  eventBilling: AddressEntry | null;
  eventDelivery: AddressEntry | null;
  client: ClientDetail | null;
  isLoading: boolean;
  discounts: number;
  subTotal: number;
  taxes: number;
  total: number;
  totalPayments: number;
  amountDue: number;
  addLogisticsTrip: (newTrip: LogisticsTrip) => void;
  fetchEvent: () => void;
}

export const EventDetailsContext = createContext<
  EventDetailsContextType | undefined
>(undefined);
