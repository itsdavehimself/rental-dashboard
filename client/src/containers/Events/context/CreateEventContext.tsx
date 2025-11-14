import { createContext } from "react";
import type { ClientDetail } from "../../Clients/types/Client";
import type { EventItem } from "../CreateEvent/CreateEvent";
import type { CreateEventModalType } from "../CreateEvent/CreateEvent";
import type { AddressEntry } from "../../../types/Address";

export interface CreateEventContextType {
  client: ClientDetail | null;
  setClient: React.Dispatch<React.SetStateAction<ClientDetail | null>>;
  selectedItems: EventItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<EventItem[]>>;
  openModal: CreateEventModalType;
  setOpenModal: React.Dispatch<React.SetStateAction<CreateEventModalType>>;
  eventBilling: AddressEntry | null;
  setEventBilling: React.Dispatch<React.SetStateAction<AddressEntry | null>>;
  eventDelivery: AddressEntry | null;
  setEventDelivery: React.Dispatch<React.SetStateAction<AddressEntry | null>>;
  clearContext: () => void;
}

export const CreateEventContext = createContext<
  CreateEventContextType | undefined
>(undefined);
