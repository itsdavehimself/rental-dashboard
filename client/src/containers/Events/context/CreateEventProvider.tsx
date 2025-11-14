import { useState } from "react";
import { CreateEventContext } from "./CreateEventContext";
import type { ClientDetail } from "../../Clients/types/Client";
import type { CreateEventModalType } from "../CreateEvent/CreateEvent";
import type { AddressEntry } from "../../../types/Address";
import type { InventoryListItem } from "../../Inventory/types/InventoryItem";

type EventItem = Omit<InventoryListItem, "quantityTotal"> & {
  count: number;
};

export const CreateEventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [selectedItems, setSelectedItems] = useState<EventItem[]>([]);
  const [openModal, setOpenModal] = useState<CreateEventModalType>(null);
  const [eventBilling, setEventBilling] = useState<AddressEntry | null>(null);
  const [eventDelivery, setEventDelivery] = useState<AddressEntry | null>(null);

  const clearContext = () => {
    setClient(null);
    setSelectedItems([]);
    setOpenModal(null);
    setEventBilling(null);
    setEventDelivery(null);
  };

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
    clearContext,
  };

  return (
    <CreateEventContext.Provider value={value}>
      {children}
    </CreateEventContext.Provider>
  );
};
