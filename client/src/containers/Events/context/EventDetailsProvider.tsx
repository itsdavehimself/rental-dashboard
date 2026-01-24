import { EventDetailsContext } from "./EventDetailsContext";
import { useToast } from "../../../hooks/useToast";
import { useFetchEvent } from "../hooks/useFetchEvent";
import { useParams } from "react-router";
import { useEffect, useState, useMemo } from "react";
import type { AddressEntry } from "../../../types/Address";
import { useFetchClient } from "../hooks/useFetchClient";
import {
  calculateTotal,
  calculateAmountDue,
  calculateSubTotal,
  calculateTaxes,
  calculateTotalPayments,
} from "../helpers/moneyHelpers";
import { getTaxRate } from "../../../service/taxService";
import type { LogisticsTrip } from "../types/Event";

export const EventDetailsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { eventUid } = useParams();
  const [eventBilling, setEventBilling] = useState<AddressEntry | null>(null);
  const [eventDelivery, setEventDelivery] = useState<AddressEntry | null>(null);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [localTrips, setLocalTrips] = useState<LogisticsTrip[]>([]);

  const clearContext = () => {};

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const {
    event: fetchedEvent,
    loading: loadingEvent,
    fetchEvent,
  } = useFetchEvent(eventUid ?? null);

  const { client, loading: loadingClient } = useFetchClient(
    fetchedEvent?.clientUid ?? null,
  );

  useEffect(() => {
    setIsLoading(loadingClient || loadingEvent);
  }, [loadingClient, loadingEvent]);

  useEffect(() => {
    if (fetchedEvent) {
      setEventBilling({
        uid: fetchedEvent.billingAddressEntryUid,
        firstName: fetchedEvent.billingFirstName,
        lastName: fetchedEvent.billingLastName,
        phoneNumber: fetchedEvent.billingPhone,
        email: fetchedEvent.billingEmail,
        addressLine1: fetchedEvent.billingAddressLine1,
        addressLine2: fetchedEvent.billingAddressLine2,
        city: fetchedEvent.billingCity,
        state: fetchedEvent.billingState,
        zipCode: fetchedEvent.billingZipCode,
      });
      setEventDelivery({
        uid: fetchedEvent.deliveryAddressEntryUid,
        firstName: fetchedEvent.deliveryFirstName,
        lastName: fetchedEvent.deliveryLastName,
        phoneNumber: fetchedEvent.deliveryPhone,
        email: fetchedEvent.deliveryEmail,
        addressLine1: fetchedEvent.deliveryAddressLine1,
        addressLine2: fetchedEvent.deliveryAddressLine2,
        city: fetchedEvent.deliveryCity,
        state: fetchedEvent.deliveryState,
        zipCode: fetchedEvent.deliveryZipCode,
      });
    }
  }, [fetchedEvent]);

  useEffect(() => {
    if (fetchedEvent?.logisticsTrips) {
      setLocalTrips(fetchedEvent.logisticsTrips);
    }
  }, [fetchedEvent?.logisticsTrips]);

  const addLogisticsTrip = (newTrip: LogisticsTrip) => {
    setLocalTrips((prev) => [...prev, newTrip]);
  };

  const { addToast } = useToast();

  const discounts = 0;

  const subTotal = useMemo(
    () => calculateSubTotal(fetchedEvent?.items ?? []),
    [fetchedEvent?.items],
  );

  const taxes = useMemo(
    () => calculateTaxes(subTotal, discounts, taxRate),
    [subTotal, discounts, taxRate],
  );

  const total = useMemo(
    () => calculateTotal(subTotal, taxes, discounts),
    [subTotal, taxes, discounts],
  );

  const totalPayments = useMemo(
    () => calculateTotalPayments(fetchedEvent?.transactions ?? []),
    [fetchedEvent?.transactions],
  );

  const amountDue = useMemo(
    () => calculateAmountDue(total, totalPayments),
    [total, totalPayments],
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
    clearContext,
    fetchedEvent: fetchedEvent
      ? { ...fetchedEvent, logisticsTrips: localTrips }
      : null,
    loadingEvent,
    eventBilling,
    eventDelivery,
    client,
    isLoading,
    discounts,
    subTotal,
    total,
    totalPayments,
    taxes,
    taxRate,
    amountDue,
    addLogisticsTrip,
    fetchEvent,
  };

  return (
    <EventDetailsContext.Provider value={value}>
      {children}
    </EventDetailsContext.Provider>
  );
};
