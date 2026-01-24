import { useState, useMemo, useEffect, useRef } from "react";
import { CreateEventContext } from "./CreateEventContext";
import type { ClientDetail } from "../../Clients/types/Client";
import type { CreateEventModalType } from "../CreateEvent/CreateEvent";
import type { AddressEntry } from "../../../types/Address";
import type { InventoryListItem } from "../../Inventory/types/InventoryItem";
import { type EventStatus, type Transaction } from "../types/Event";
import { getTaxRate } from "../../../service/taxService";
import { useToast } from "../../../hooks/useToast";
import { useLocation } from "react-router";
import { useFetchEvent } from "../hooks/useFetchEvent";
import { useFetchClient } from "../hooks/useFetchClient";
import { mapAddressResToEvent } from "../helpers/mapAddressResToEvent";
import { mapItemResToEvent } from "../helpers/mapItemResToEvent";
import { useNavigate } from "react-router";
import {
  calculateAmountDue,
  calculateSubTotal,
  calculateTaxes,
  calculateTotal,
  calculateTotalPayments,
} from "../helpers/moneyHelpers";

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
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventNotes, setEventNotes] = useState<string | null>(null);
  const [internalNotes, setInternalNotes] = useState<string | null>(null);
  const [eventType, setEventType] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<EventStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFormHydrated, setIsFormHydrated] = useState<boolean>(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const clientUid = params.get("clientId");
  const eUid = params.get("eventId");

  const navigate = useNavigate();

  const { client: fetchedClient, loading: loadingClient } =
    useFetchClient(clientUid);

  const {
    event: fetchedEvent,
    loading: loadingEvent,
    eventStart,
    eventEnd,
  } = useFetchEvent(eUid);

  useEffect(() => {
    if (!fetchedClient) return;
    setClient(fetchedClient);
  }, [fetchedClient, setClient]);

  const previousClientUid = useRef<string | null>(null);

  useEffect(() => {
    if (!client) return;

    const isInitialClientLoad = previousClientUid.current === null;
    const isClientChangedByUser =
      previousClientUid.current !== null &&
      previousClientUid.current !== client.uid;

    previousClientUid.current = client.uid;

    if (eventUid && isInitialClientLoad) {
      return;
    }

    if (!eventUid && isInitialClientLoad) {
      setPrimaryAddressesFromClient(client);
      return;
    }

    if (isClientChangedByUser) {
      setPrimaryAddressesFromClient(client);
    }
  }, [client]);

  function setPrimaryAddressesFromClient(client: ClientDetail) {
    if (client.billingAddresses?.length) {
      const primaryBilling =
        client.billingAddresses.find((a) => a.isPrimary) ??
        client.billingAddresses[0];
      setEventBilling(primaryBilling);
    }

    if (client.deliveryAddresses?.length) {
      const primaryDelivery =
        client.deliveryAddresses.find((a) => a.isPrimary) ??
        client.deliveryAddresses[0];
      setEventDelivery(primaryDelivery);
    }
  }

  useEffect(() => {
    if (!fetchedEvent) return;
    setEventName(fetchedEvent.eventName);
    setInternalNotes(fetchedEvent.internalNotes);
    setEventNotes(fetchedEvent.notes);
    setEventType(fetchedEvent.eventType);
    setEventUid(fetchedEvent?.uid);
    setEventStatus(fetchedEvent.status);
    setTransactions(
      fetchedEvent.transactions.sort((a, b) =>
        b.occurredAt.localeCompare(a.occurredAt)
      )
    );
    const mappedAddresses = mapAddressResToEvent(fetchedEvent);
    setEventBilling(mappedAddresses.billing);
    setEventDelivery(mappedAddresses.delivery);
    const eventItems = mapItemResToEvent(fetchedEvent?.items);
    setSelectedItems(eventItems);
    setIsFormHydrated(true);
  }, [fetchedEvent, eventStart, eventEnd]);

  useEffect(() => {
    setIsLoading(loadingClient || loadingEvent || !isFormHydrated);
  }, [loadingClient, loadingEvent, isFormHydrated]);

  useEffect(() => {
    if (clientUid === "") {
      navigate("/dashboard");
    }
  }, []);

  const clearContext = () => {
    setClient(null);
    setSelectedItems([]);
    setOpenModal(null);
    setEventBilling(null);
    setEventDelivery(null);
    setEventUid(null);
    setTransactions([]);
    setTaxRate(0);
    setEventStatus(null);
    setEventBilling(null);
    setEventDelivery(null);
    setEventName(null);
    setEventNotes(null);
    setInternalNotes(null);
    setIsFormHydrated(false);
  };

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const { addToast } = useToast();

  const discounts = 0;

  const subTotal = useMemo(
    () => calculateSubTotal(selectedItems),
    [selectedItems]
  );

  const taxes = useMemo(
    () => calculateTaxes(subTotal, discounts, taxRate),
    [subTotal, discounts, taxRate]
  );

  const total = useMemo(
    () => calculateTotal(subTotal, taxes, discounts),
    [subTotal, taxes, discounts]
  );

  const totalPayments = useMemo(
    () => calculateTotalPayments(transactions),
    [transactions]
  );

  const amountDue = useMemo(
    () => calculateAmountDue(total, totalPayments),
    [total, totalPayments]
  );

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
    isLoading,
    eventName,
    eventNotes,
    internalNotes,
    eventType,
    eventStart,
    eventEnd,
    setEventStatus,
    eventStatus,
  };

  return (
    <CreateEventContext.Provider value={value}>
      {children}
    </CreateEventContext.Provider>
  );
};
