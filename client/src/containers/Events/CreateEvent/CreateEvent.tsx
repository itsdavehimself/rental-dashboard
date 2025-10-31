import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { getClientDetails } from "../../../service/clientService";
import { useToast } from "../../../hooks/useToast";
import { type ErrorsState, handleError } from "../../../helpers/handleError";
import ResidentialClientInfo from "./components/ResidentialClientInfo";
import EventScheduleSection from "./components/EventScheduleSection";
import EventDetailsSection from "./components/EventDetailsSection";
import ItemsAndServices from "./components/ItemsAndServices";
import EventTotals from "./components/EventTotals";
import ActionButton from "../../../components/common/ActionButton";
import { Save } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router";
import { useForm, type SubmitHandler } from "react-hook-form";
import { splitPhoneNumber } from "../../../helpers/formatPhoneNumber";
import EditModal from "../../../components/common/EditModal";
import EditClientNotes from "./components/EditClientNotes";
import EditAddresses from "./components/EditAddresses";
import EventInternalNotes from "./components/EventInternalNotes";
import { useCreateEvent } from "../../../context/useCreateEvent";

export type CreateEventModalType =
  | null
  | "editClientBilling"
  | "editClientDelivery"
  | "editClientNotes"
  | "changeClient"
  | "addBillingAddress"
  | "addDeliveryAddress";

export type CreateEventInputs = {
  deliveryDate: Date;
  deliveryTime: string;
  pickUpDate: Date;
  pickUpTime: string;
  eventName?: string;
  eventType: string;
  eventNotes: string;
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string;
  contactEmail: string;
  internalNotes: string;
};

const CreateEvent: React.FC = () => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<CreateEventInputs>({});

  const { client, setClient, openModal, selectedItems } = useCreateEvent();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const clientId = params.get("clientId");
  const [errors, setErrors] = useState<ErrorsState>(null);

  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const deliveryDate = watch("deliveryDate");
  const deliveryTime = watch("deliveryTime");
  const pickUpDate = watch("pickUpDate");
  const pickUpTime = watch("pickUpTime");

  const fetchClient = async () => {
    try {
      if (clientId) {
        const client = await getClientDetails(apiUrl, clientId);
        setClient(client);
      }
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching client data.");
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchClient();
  }, []);

  useEffect(() => {
    if (clientId === "") {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (pickUpDate < deliveryDate) {
      setValue("pickUpDate", deliveryDate);
    }
  }, [deliveryDate]);

  useEffect(() => {
    if (client) {
      setValue("contactFirstName", client.firstName || "");
      setValue("contactLastName", client.lastName || "");
      setValue("contactPhone", splitPhoneNumber(client.phoneNumber) || "");
      setValue("contactEmail", client.email || "");
    }
  }, [client]);

  const onSubmit: SubmitHandler<CreateEventInputs> = async (data) => {
    try {
      console.log(data);
      console.log(selectedItems);
    } catch (err) {
      console.log("error");
    }
  };

  return (
    <div className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
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
      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold">Create Event</h2>
        <div className="flex gap-4 w-fit">
          <ActionButton
            label="Save Draft"
            onClick={() => console.log("saved")}
            style="outline"
            icon={Save}
          />
          <ActionButton
            label="Reserve"
            onClick={handleSubmit(onSubmit)}
            style="filled"
            icon={CalendarCheck}
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
