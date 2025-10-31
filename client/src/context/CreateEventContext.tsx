import { createContext } from "react";
import type { ClientDetail } from "../types/Client";
import type { InventoryItemSearchResult } from "../types/InventoryItem";
import type { CreateEventModalType } from "../containers/Events/CreateEvent/CreateEvent";
import type { AddressEntry } from "../types/Address";

export type SelectedItem = InventoryItemSearchResult & {
  quantitySelected: number;
};

export interface CreateEventContextType {
  client: ClientDetail | null;
  setClient: React.Dispatch<React.SetStateAction<ClientDetail | null>>;
  selectedItems: SelectedItem[];
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  openModal: CreateEventModalType;
  setOpenModal: React.Dispatch<React.SetStateAction<CreateEventModalType>>;
  eventBilling: AddressEntry | null;
  setEventBilling: React.Dispatch<React.SetStateAction<AddressEntry | null>>;
  eventDelivery: AddressEntry | null;
  setEventDelivery: React.Dispatch<React.SetStateAction<AddressEntry | null>>;
}

export const CreateEventContext = createContext<
  CreateEventContextType | undefined
>(undefined);
