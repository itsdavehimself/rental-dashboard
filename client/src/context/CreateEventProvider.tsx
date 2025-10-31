import { useState } from "react";
import { CreateEventContext } from "./CreateEventContext";
import type { ClientDetail } from "../types/Client";
import type { CreateEventModalType } from "../containers/Events/CreateEvent/CreateEvent";
import type { InventoryItemSearchResult } from "../types/InventoryItem";
import type { AddressEntry } from "../types/Address";

export type SelectedItem = InventoryItemSearchResult & {
  quantitySelected: number;
};

export const CreateEventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [openModal, setOpenModal] = useState<CreateEventModalType>(null);
  const [eventBilling, setEventBilling] = useState<AddressEntry | null>(null);
  const [eventDelivery, setEventDelivery] = useState<AddressEntry | null>(null);

  const value = {
    client,
    setClient,
    selectedItems,
    setSelectedItems,
    openModal,
    setOpenModal,
    eventBilling,
    setEventBilling,
    eventDelivery,
    setEventDelivery,
  };

  return (
    <CreateEventContext.Provider value={value}>
      {children}
    </CreateEventContext.Provider>
  );
};
