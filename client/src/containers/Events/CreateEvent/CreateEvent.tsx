import { useEffect, useState } from "react";
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
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import EditModal from "../../../components/common/EditModal";
import EditClientNotes from "./components/EditClientNotes";
import EditAddresses from "./components/EditAddresses";
import EventInternalNotes from "./components/EventInternalNotes";
import { useCreateEvent } from "../hooks/useCreateEvent";
import SearchClients from "../../Clients/components/SearchClients";
import type { InventoryListItem } from "../../Inventory/types/InventoryItem";
import { saveEvent } from "../services/eventService";
import PaymentForm from "./components/TransactionModal";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useFetchAvailability } from "../hooks/useFetchAvailability";
import formatToUTC from "../../../helpers/formatToUTC";

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
  startDate: Date;
  startTime: string;
  endDate: Date;
  endTime: string;
  eventName: string | null;
  eventType: string | null;
  eventNotes: string | null;
  internalNotes: string | null;
};

const CreateEvent: React.FC = () => {
  const {
    client,
    openModal,
    setOpenModal,
    selectedItems,
    setSelectedItems,
    eventBilling,
    eventDelivery,
    setEventUid,
    clearContext,
    eventStatus,
    eventName,
    eventNotes,
    internalNotes,
    eventType,
    isLoading,
    eventUid,
    eventStart,
    eventEnd,
  } = useCreateEvent();

  const methods = useForm<CreateEventInputs>();

  const { handleSubmit, register, watch, setValue, setError, clearErrors } =
    methods;

  const [errors, setErrors] = useState<ErrorsState>(null);

  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const startDate = watch("startDate");
  const startTime = watch("startTime");
  const endDate = watch("endDate");
  const endTime = watch("endTime");

  const [availabilityParams, setAvailabilityParams] = useState({
    startD: startDate,
    startT: startTime,
    endD: endDate,
    endT: endTime,
  });

  const datesSelected = !!(startDate && startTime && endDate && endTime);

  const canSaveDraft = client && eventBilling && eventDelivery && datesSelected;

  const isDraft = eventStatus === "Draft";
  const isNew = !eventUid;

  const saveAction = isNew ? "draft" : "update";
  const saveLabel = isDraft ? "Save Draft" : "Update Event";

  useEffect(() => {
    if (!eventUid || !eventStart || !eventEnd) return;
    setValue("startDate", eventStart.date);
    setValue("startTime", eventStart.time);
    setValue("endDate", eventEnd.date);
    setValue("endTime", eventEnd.time);
    setValue("eventName", eventName);
    setValue("eventNotes", eventNotes);
    setValue("internalNotes", internalNotes);
    setValue("eventType", eventType);
    if (!eventName) {
      setValue("eventName", `${client?.firstName}'s Event`);
    }
  }, [
    eventStart,
    eventEnd,
    setValue,
    eventNotes,
    eventName,
    internalNotes,
    eventType,
    eventUid,
    client,
  ]);

  useEffect(() => {
    if (endDate < startDate) {
      setValue("endDate", startDate);
    }
  }, [startDate]);

  useFetchAvailability(
    apiUrl,
    selectedItems,
    availabilityParams.startD,
    availabilityParams.startT,
    availabilityParams.endD,
    availabilityParams.endT,
    setSelectedItems,
    eventUid,
  );

  useEffect(() => {
    const timeRegex = /^\d{1,2}:\d{2}(am|pm)$/;

    if (
      startDate &&
      endDate &&
      timeRegex.test(startTime) &&
      timeRegex.test(endTime)
    ) {
      setAvailabilityParams({
        startD: startDate,
        startT: startTime,
        endD: endDate,
        endT: endTime,
      });
    }
  }, [startDate, startTime, endDate, endTime]);

  const formattedStartDateTime = formatToUTC(startDate, startTime);
  const formattedEndDateTime = formatToUTC(endDate, endTime);

  const onFormSubmit = async (
    data: CreateEventInputs,
    action: "draft" | "reserve" | "update",
  ) => {
    if (
      !client ||
      !eventBilling ||
      !eventDelivery ||
      !datesSelected ||
      !formattedStartDateTime ||
      !formattedEndDateTime
    )
      return;

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

      const event = await saveEvent(
        apiUrl,
        data,
        formattedStartDateTime,
        formattedEndDateTime,
        items,
        uids,
        eventUid,
        action,
      );

      if (!eventUid) {
        setEventUid(event.uid);
        navigate(`?clientId=${client.uid}&eventId=${event.uid}`, {
          replace: true,
        });
      }

      if (action === "reserve") {
        addToast("Success", "Event reserved.");
      } else if (action === "draft") {
        addToast("Success", "Draft saved.");
      } else {
        addToast("Success", "Event updated.");
      }

      if (action === "reserve") {
        navigate(`/events/${eventUid}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        addToast("Error", err.message);
      } else {
        addToast("Error", String(err));
      }
    }
  };

  useEffect(() => {
    return () => {
      clearContext();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6 justify-center items-center">
        <div className="flex justify-center items-center w-full text-sm text-gray-400 h-10">
          <LoadingSpinner dimensions={{ x: 10, y: 10 }} />
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 3xl:gap-4 4xl:gap-6">
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
          <h2 className="text-2xl font-semibold">
            {eventUid ? "Edit Event" : "Create Event"}
          </h2>
          <div className="flex gap-4 items-center justify-center">
            {eventStatus === "Draft" ? (
              <>
                {/* LEFT BUTTON: Save or Update Draft */}
                <ActionButton
                  label="Save Draft"
                  onClick={handleSubmit((data) =>
                    onFormSubmit(data, eventUid ? "update" : "draft"),
                  )}
                  style="outline"
                  icon={Save}
                  disabled={!canSaveDraft}
                />
                {/* RIGHT BUTTON: Reserve */}
                <ActionButton
                  label="Reserve"
                  onClick={handleSubmit((data) =>
                    onFormSubmit(data, "reserve"),
                  )}
                  style="filled"
                  icon={CalendarCheck}
                  disabled={!canSaveDraft || !eventUid}
                />
              </>
            ) : (
              <div className="flex gap-8 justify-center items-center">
                <button
                  type="button"
                  onClick={() => navigate(`/events/${eventUid}`)}
                  className="text-sm font-semibold text-gray-500 hover:text-primary transition-colors duration-200 hover:cursor-pointer"
                >
                  Back to Event Details
                </button>
                <ActionButton
                  label="Update Event"
                  onClick={handleSubmit((data) => onFormSubmit(data, "update"))}
                  style="filled"
                  icon={CalendarCheck}
                  disabled={!canSaveDraft || !eventUid}
                />
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col 4xl:grid 4xl:grid-cols-[1fr_400px] 3xl:gap-4 4xl:gap-8 h-full">
          <div className="flex 3xl:flex-row 4xl:flex-col 3xl:gap-4 4xl:gap-8 w-full">
            <div className="3xl:flex 3xl:flex-col 4xl:grid 4xl:grid-cols-[1.8fr_1fr] 3xl:gap-4 4xl:gap-8 h-fit 3xl:w-1/2 4xl:w-full">
              <div className="flex flex-col 3xl:gap-4 4xl:gap-8 h-full">
                <EventScheduleSection />
                <div className="3xl:hidden 4xl:inline">
                  <EventInternalNotes register={register} />
                </div>
              </div>
              <EventDetailsSection register={register} />
            </div>
            <ItemsAndServices />
          </div>
          <div className="grid grid-cols-3 gap-4 4xl:hidden">
            <ResidentialClientInfo />
            <EventInternalNotes register={register} />
            <EventTotals />
          </div>
          <div className="flex flex-col 3xl:gap-4 4xl:gap-8 h-full flex-grow 3xl:hidden 4xl:flex">
            <ResidentialClientInfo />
            <EventTotals />
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default CreateEvent;
