import { useState, useEffect, useMemo } from "react";
import { BillingContext } from "./BillingContext";
import type { InventoryListItem } from "../../Inventory/types/InventoryItem";
import type { AddressEntry } from "../../../types/Address";
import type { Transaction } from "../types/Event";
import { useToast } from "../../../hooks/useToast";
import {
  calculateAmountDue,
  calculateSubTotal,
  calculateTaxes,
  calculateTotal,
  calculateTotalPayments,
} from "../helpers/moneyHelpers";
import { getTaxRate } from "../../../service/taxService";
import { useFetchEvent } from "../hooks/useFetchEvent";
import { useLocation, useParams } from "react-router";
import { mapAddressResToEvent } from "../helpers/mapAddressResToEvent";
import { mapItemResToEvent } from "../helpers/mapItemResToEvent";

type EventLineItem = Omit<InventoryListItem, "quantityTotal"> & {
  count: number;
  quantityAvailable: number;
  availabilityChecked: boolean;
};

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedItems, setSelectedItems] = useState<EventLineItem[]>([]);
  const [eventDelivery, setEventDelivery] = useState<AddressEntry | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [taxRate, setTaxRate] = useState(0);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();

  const location = useLocation();
  const { eventUid: pathEventId } = useParams();

  const params = new URLSearchParams(location.search);
  const queryEventId = params.get("eventId");

  const eUid = pathEventId || queryEventId;

  const { event: fetchedEvent, loading: loadingEvent } = useFetchEvent(eUid);

  useEffect(() => {
    if (eUid && loadingEvent) return;

    if (eUid && fetchedEvent) {
      setTransactions(
        [...fetchedEvent.transactions].sort((a, b) =>
          b.occurredAt.localeCompare(a.occurredAt),
        ),
      );

      const mappedAddresses = mapAddressResToEvent(fetchedEvent);
      setEventDelivery(mappedAddresses.delivery);

      const eventItems = mapItemResToEvent(fetchedEvent.items);

      setSelectedItems((prev) => {
        if (prev.length > 0 && prev.length === eventItems.length) {
          return prev;
        }
        return eventItems;
      });
    }
  }, [fetchedEvent, eUid, loadingEvent]);

  const discounts = 0;

  const subTotal = useMemo(
    () => calculateSubTotal(selectedItems),
    [selectedItems],
  );
  const taxes = useMemo(
    () => calculateTaxes(subTotal, discounts, taxRate),
    [subTotal, taxRate],
  );
  const total = useMemo(
    () => calculateTotal(subTotal, taxes, discounts),
    [subTotal, taxes],
  );
  const totalPayments = useMemo(
    () => calculateTotalPayments(transactions),
    [transactions],
  );
  const amountDue = useMemo(
    () => calculateAmountDue(total, totalPayments),
    [total, totalPayments],
  );

  useEffect(() => {
    const fetchTaxRate = async () => {
      if (eventDelivery?.zipCode) {
        try {
          const taxRes = await getTaxRate(apiUrl, eventDelivery.zipCode);
          setTaxRate(taxRes.taxRate);
        } catch (err) {
          addToast("Error", "There was a problem getting the tax rate.");
        }
      }
    };
    fetchTaxRate();
  }, [eventDelivery?.zipCode, apiUrl, addToast]);

  const clearContext = () => {
    setSelectedItems([]);
    setTransactions([]);
    setEventDelivery(null);
    setTaxRate(0);
  };

  const value = {
    discounts,
    subTotal,
    taxes,
    total,
    totalPayments,
    amountDue,
    taxRate,
    selectedItems,
    setSelectedItems,
    transactions,
    setTransactions,
    clearContext,
  };
  return (
    <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
  );
};
