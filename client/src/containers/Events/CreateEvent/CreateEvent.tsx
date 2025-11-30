import { useLocation } from "react-router";
import { useEffect, useState, useRef } from "react";
import { useToast } from "../../../hooks/useToast";
import { type ErrorsState, handleError } from "../../../helpers/handleError";
import ResidentialClientInfo from "./components/ResidentialClientInfo";
import EventScheduleSection from "./components/EventScheduleSection";
import EventDetailsSection from "./components/EventDetailsSection";
import ItemsAndServices from "./components/ItemsAndServices";
import EventTotals from "./components/EventTotals";
import ActionButton from "../../../components/common/ActionButton";
import { Save, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import EditModal from "../../../components/common/EditModal";
import EditClientNotes from "./components/EditClientNotes";
import EditAddresses from "./components/EditAddresses";
import EventInternalNotes from "./components/EventInternalNotes";
import { useCreateEvent } from "../hooks/useCreateEvent";
import SearchClients from "../../Clients/components/SearchClients";
import type { InventoryListItem } from "../../Inventory/types/InventoryItem";
import { upsertEventDraft } from "../services/eventService";
import PaymentForm from "./components/PaymentForm";
import { useFetchClient } from "../hooks/useFetchClient";
import { useFetchEvent } from "../hooks/useFetchEvent";
import { mapItemResToEvent } from "../helpers/mapItemResToEvent";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { mapAddressResToEvent } from "../helpers/mapAddressResToEvent";
import { useFetchAvailability } from "../hooks/useFetchAvailability";

export type CreateEventModalType =
  | null
  | "editClientBilling"
  | "editClientDelivery"
  | "editClientNotes"
  | "changeClient"
  | "addBillingAddress"
  | "addDeliveryAddress"
  | "searchClient"
  | "addPayment";

export type EventLineItem = Omit<InventoryListItem, "quantityTotal"> & {
  count: number;
  quantityAvailable: number;
  availabilityChecked: boolean;
};

export type ItemBasics = Omit<
  InventoryListItem,
  "quantityTotal" | "description" | "sku" | "unitPrice" | "uid"
> & { inventoryItemUid: string };

export type CreateEventInputs = {
  deliveryDate: Date;
  deliveryTime: string;
  pickUpDate: Date;
  pickUpTime: string;
  eventName?: string;
  eventType: string;
  eventNotes?: string;
  internalNotes?: string;
};

const CreateEvent: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const clientUid = params.get("clientId");
  const eventUid = params.get("eventId");

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<CreateEventInputs>({});

  const {
    client,
    setClient,
    openModal,
    setOpenModal,
    selectedItems,
    setSelectedItems,
    setEventBilling,
    setEventDelivery,
    eventBilling,
    eventDelivery,
    setEventUid,
    setPayments,
    clearContext,
  } = useCreateEvent();

  const {
    client: fetchedClient,
    loading: loadingClient,
    fetchClient,
  } = useFetchClient(clientUid);

  const {
    event: fetchedEvent,
    loading: loadingEvent,
    fetchEvent,
    eventStart,
    eventEnd,
  } = useFetchEvent(eventUid);

  const [errors, setErrors] = useState<ErrorsState>(null);

  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const deliveryDate = watch("deliveryDate");
  const deliveryTime = watch("deliveryTime");
  const pickUpDate = watch("pickUpDate");
  const pickUpTime = watch("pickUpTime");

  const datesSelected = !!(
    deliveryDate &&
    deliveryTime &&
    pickUpDate &&
    pickUpTime
  );

  const canSaveDraft = client && eventBilling && eventDelivery && datesSelected;

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

  function setPrimaryAddressesFromClient(client) {
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
    if (!fetchedEvent || !eventStart || !eventEnd) return;
    setValue("deliveryDate", eventStart.date);
    setValue("deliveryTime", eventStart.time);
    setValue("pickUpDate", eventEnd.date);
    setValue("pickUpTime", eventEnd.time);
    setValue("eventName", fetchedEvent?.eventName);
    setValue("eventNotes", fetchedEvent?.notes);
    setValue("internalNotes", fetchedEvent?.internalNotes);
    setValue("eventType", fetchedEvent?.eventType);
    setEventUid(fetchedEvent?.uid);
    setPayments(fetchedEvent.payments);
    const mappedAddresses = mapAddressResToEvent(fetchedEvent);
    setEventBilling(mappedAddresses.billing);
    setEventDelivery(mappedAddresses.delivery);
    const eventItems = mapItemResToEvent(fetchedEvent?.items);
    setSelectedItems(eventItems);
  }, [fetchedEvent, eventStart, eventEnd, setValue]);

  useEffect(() => {
    if (clientUid === "") {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (pickUpDate < deliveryDate) {
      setValue("pickUpDate", deliveryDate);
    }
  }, [deliveryDate]);

  useFetchAvailability(
    apiUrl,
    selectedItems,
    deliveryDate,
    deliveryTime,
    pickUpDate,
    pickUpTime,
    setSelectedItems
  );

  const saveDraftSubmit: SubmitHandler<CreateEventInputs> = async (data) => {
    if (!client || !eventBilling || !eventDelivery || !datesSelected) return;

    try {
      const items = selectedItems.map((i) => ({
        inventoryItemUid: i.uid,
        quantity: i.count,
      }));

      const uids = {
        clientUid: client.uid,
        billingUid: eventBilling.uid,
        deliveryUid: eventDelivery.uid,
      };

      const event = await upsertEventDraft(apiUrl, data, items, uids, eventUid);

      if (!eventUid) setEventUid(event.uid);

      addToast(
        "Success",
        eventUid ? "Event draft updated." : "Event saved as draft."
      );
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    return () => {
      clearContext();
    };
  }, []);

  if (loadingEvent || loadingClient) {
    return (
      <div className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6 justify-center items-center">
        <div className="flex justify-center items-center w-full text-sm text-gray-400 h-10">
          <LoadingSpinner dimensions={{ x: 10, y: 10 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      {openModal === "searchClient" && (
        <SearchClients<CreateEventModalType>
          openModal={openModal}
          setOpenModal={setOpenModal}
          setErrors={setErrors}
          title="Change Client"
          label="Update Client"
          mode="update"
        />
      )}
      {openModal === "editClientNotes" && (
        <EditModal children={<EditClientNotes title="Edit client notes" />} />
      )}
      {openModal === "editClientBilling" && client?.billingAddresses && (
        <EditModal
          children={<EditAddresses type="billing" setErrors={setErrors} />}
        />
      )}
      {openModal === "editClientDelivery" && client?.deliveryAddresses && (
        <EditModal
          children={<EditAddresses type="delivery" setErrors={setErrors} />}
        />
      )}
      {openModal === "addPayment" && <EditModal children={<PaymentForm />} />}
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Create Event</h2>
        <div className="flex gap-4 w-fit">
          <ActionButton
            label="Save Draft"
            onClick={handleSubmit(saveDraftSubmit)}
            style="outline"
            icon={Save}
            disabled={!canSaveDraft}
          />
          <ActionButton
            label="Reserve"
            onClick={() => console.log("reserve")}
            style="filled"
            icon={CalendarCheck}
            disabled={!canSaveDraft}
          />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_.2fr] gap-8 h-full">
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-[1.8fr_1fr] gap-8 h-fit w-full">
            <div className="flex flex-col gap-8 h-full">
              <EventScheduleSection
                deliveryDate={deliveryDate}
                deliveryTime={deliveryTime}
                pickUpDate={pickUpDate}
                pickUpTime={pickUpTime}
                setValue={setValue}
                formErrors={formErrors}
              />
              <EventInternalNotes register={register} />
            </div>
            <EventDetailsSection register={register} />
          </div>
          <ItemsAndServices />
        </div>
        <div className="flex flex-col gap-8 h-full flex-grow">
          <ResidentialClientInfo />
          <EventTotals />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
