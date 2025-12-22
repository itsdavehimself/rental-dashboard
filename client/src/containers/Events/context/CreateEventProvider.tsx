import { useState, useMemo, useEffect } from "react";
import { CreateEventContext } from "./CreateEventContext";
import type { ClientDetail } from "../../Clients/types/Client";
import type { CreateEventModalType } from "../CreateEvent/CreateEvent";
import type { AddressEntry } from "../../../types/Address";
import type { InventoryListItem } from "../../Inventory/types/InventoryItem";
import type { Transaction } from "../types/Event";
import { getTaxRate } from "../../../service/taxService";
import { useToast } from "../../../hooks/useToast";

type EventLineItem = Omit<InventoryListItem, "quantityTotal"> & {
  count: number;
  quantityAvailable: number;
  availabilityChecked: boolean;
};

export const CreateEventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [selectedItems, setSelectedItems] = useState<EventLineItem[]>([]);
  const [openModal, setOpenModal] = useState<CreateEventModalType>(null);
  const [eventBilling, setEventBilling] = useState<AddressEntry | null>(null);
  const [eventDelivery, setEventDelivery] = useState<AddressEntry | null>(null);
  const [eventUid, setEventUid] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [taxRate, setTaxRate] = useState(0);

  const clearContext = () => {
    setClient(null);
    setSelectedItems([]);
    setOpenModal(null);
    setEventBilling(null);
    setEventDelivery(null);
    setEventUid(null);
  };

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const { addToast } = useToast();

  const money = (n: number) => Number(n.toFixed(2));

  const discounts = 0;

  const subTotal = useMemo(() => {
    const value = selectedItems.reduce(
      (total, item) => total + item.count * (item.unitPrice ?? 0),
      0
    );
    return money(value);
  }, [selectedItems]);

  const taxes = useMemo(() => {
    const value = ((subTotal - discounts) * taxRate) / 100;
    return money(value);
  }, [subTotal, discounts, taxRate]);

  const total = useMemo(() => {
    const value = subTotal + taxes - discounts;
    return money(value);
  }, [subTotal, taxes, discounts]);

  const totalPayments = useMemo(() => {
    const value = transactions.reduce((sum, p) => sum + p.amount, 0);
    return money(value);
  }, [transactions]);

  const amountDue = useMemo(() => {
    const value = total - totalPayments;
    return money(value);
  }, [total, totalPayments]);

  const fetchTaxRate = async () => {
    if (eventDelivery?.zipCode)
      try {
        const taxRes = await getTaxRate(apiUrl, eventDelivery?.zipCode);
        setTaxRate(taxRes.taxRate);
      } catch (err) {
        addToast("Error", "There was a problem getting the tax rate.");
      }
  };

  useEffect(() => {
    fetchTaxRate();
  }, [eventDelivery?.zipCode]);

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
    eventUid,
    setEventUid,
    transactions,
    setTransactions,
    subTotal,
    discounts,
    taxes,
    total,
    totalPayments,
    amountDue,
    taxRate,
    setTaxRate,
  };

  return (
    <CreateEventContext.Provider value={value}>
      {children}
    </CreateEventContext.Provider>
  );
};
