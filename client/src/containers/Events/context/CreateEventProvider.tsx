import { useState, useEffect, useRef, useMemo } from "react";
import { CreateEventContext } from "./CreateEventContext";
import type { ClientDetail } from "../../Clients/types/Client";
import type { CreateEventModalType } from "../CreateEvent/CreateEvent";
import type { AddressEntry } from "../../../types/Address";
import type { InventoryListItem } from "../../Inventory/types/InventoryItem";
import { type EventStatus, type Transaction } from "../types/Event";
import { useLocation, useNavigate } from "react-router";
import { useFetchEvent } from "../hooks/useFetchEvent";
import { useFetchClient } from "../hooks/useFetchClient";
import { useToast } from "../../../hooks/useToast";
import { getTaxRate } from "../../../service/taxService";
import { mapAddressResToEvent } from "../helpers/mapAddressResToEvent";
import { mapItemResToEvent } from "../helpers/mapItemResToEvent";
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
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventNotes, setEventNotes] = useState<string | null>(null);
  const [internalNotes, setInternalNotes] = useState<string | null>(null);
  const [eventType, setEventType] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<EventStatus | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [taxRate, setTaxRate] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const clientUid = params.get("clientId");
  const eUid = params.get("eventId");

  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const { client: fetchedClient, loading: loadingClient } =
    useFetchClient(clientUid);
  const {
    event: fetchedEvent,
    loading: loadingEvent,
    eventStart,
    eventEnd,
  } = useFetchEvent(eUid);

  const isActuallyLoading = useMemo(() => {
    if (loadingClient) return true;
    if (eUid && loadingEvent) return true;

    if (eUid && eventUid !== eUid) return true;

    return false;
  }, [loadingClient, loadingEvent, eUid, eventUid]);

  useEffect(() => {
    setIsLoading(isActuallyLoading);
  }, [isActuallyLoading]);

  useEffect(() => {
    if (loadingClient || (eUid && loadingEvent)) return;

    if (fetchedClient) {
      setClient(fetchedClient);
    }

    if (eUid && fetchedEvent && eventUid !== eUid) {
      setEventName(fetchedEvent.eventName);
      setInternalNotes(fetchedEvent.internalNotes);
      setEventNotes(fetchedEvent.notes);
      setEventType(fetchedEvent.eventType);
      setEventUid(fetchedEvent.uid);
      setEventStatus(fetchedEvent.status);
      setTransactions(
        [...fetchedEvent.transactions].sort((a, b) =>
          b.occurredAt.localeCompare(a.occurredAt),
        ),
      );

      const mappedAddresses = mapAddressResToEvent(fetchedEvent);
      setEventBilling(mappedAddresses.billing);
      setEventDelivery(mappedAddresses.delivery);

      const eventItems = mapItemResToEvent(fetchedEvent.items);
      setSelectedItems(eventItems);
    }
  }, [
    fetchedClient,
    fetchedEvent,
    eUid,
    loadingClient,
    loadingEvent,
    eventUid,
  ]);

  const previousClientUid = useRef<string | null>(null);

  useEffect(() => {
    if (!client) return;

    const isInitialClientLoad = previousClientUid.current === null;
    const isClientChangedByUser =
      previousClientUid.current !== null &&
      previousClientUid.current !== client.uid;

    previousClientUid.current = client.uid;

    if (!eUid && (isInitialClientLoad || isClientChangedByUser)) {
      setPrimaryAddressesFromClient(client);
    }
  }, [client, eUid]);

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

  useEffect(() => {
    if (clientUid === "") {
      navigate("/dashboard");
    }
  }, [clientUid, navigate]);

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
    setEventName(null);
    setEventNotes(null);
    setInternalNotes(null);
    setEventType(null);
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
