import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { type ClientDetail } from "../../../types/Client";
import { getClientDetails } from "../../../service/clientService";
import { useToast } from "../../../hooks/useToast";
import { type ErrorsState, handleError } from "../../../helpers/handleError";
import ResidentialClientInfo from "./components/ResidentialClientInfo";
import EventScheduleSection from "./components/EventScheduleSection";
import EventDetailsSection from "./components/EventDetailsSection";
import EventContactSection from "./components/EventContactSection";
import ItemsAndServices from "./components/ItemsAndServices";
import EventTotals from "./components/EventTotals";
import ActionButton from "../../../components/common/ActionButton";
import { Save } from "lucide-react";
import { CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router";

const CreateEvent: React.FC = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const clientId = params.get("clientId");
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

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
  console.log(client);

  useEffect(() => {
    fetchClient();
  }, []);

  useEffect(() => {
    if (clientId === "") {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
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
            onClick={() => console.log("reserved")}
            style="filled"
            icon={CalendarCheck}
          />
        </div>
      </div>
      <div className="grid grid-cols-[1fr_.2fr] gap-10 h-full">
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-[1.6fr_1fr] gap-10 h-fit w-full">
            <div className="flex flex-col gap-10 h-full">
              <EventScheduleSection />
              <EventContactSection client={client} />
            </div>
            <EventDetailsSection />
          </div>
          <ItemsAndServices />
        </div>
        <div className="flex flex-col gap-10 h-full flex-grow">
          <ResidentialClientInfo client={client} />
          <EventTotals />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
