import AddressBlock from "./AddressBlock";
import { useEventDetails } from "../../hooks/useEventDetails";
import { useNavigate } from "react-router";
import { Calendar1, Clock } from "lucide-react";
import { formatDate } from "date-fns";

const EventDetailsSection: React.FC = () => {
  const { fetchedEvent, eventBilling, eventDelivery } = useEventDetails();
  const navigate = useNavigate();

  if (!fetchedEvent) {
    navigate("/dashboard");
    return;
  }

  return (
    <section className="flex flex-col flex-grow gap-6 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
      <h3 className="text-lg font-semibold text-primary">Event Details</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col">
          <h4 className="font-semibold mb-1">Event Start</h4>
          <div className="flex gap-2 items-center">
            <Calendar1 className="text-gray-500 w-4 h-4" />
            <p className="text-sm">
              {formatDate(fetchedEvent.eventStart, "EEE, MMM dd, yyyy")}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Clock className="text-gray-500 w-4 h-4" />
            <p className="text-sm">
              {formatDate(fetchedEvent.eventStart, "h:mma").toLowerCase()}
            </p>
          </div>
        </div>
        <div className="flex flex-col">
          <h4 className="font-semibold">Event End</h4>
          <div className="flex gap-2 items-center">
            <Calendar1 className="text-gray-500 w-4 h-4" />
            <p className="text-sm">
              {formatDate(fetchedEvent.eventEnd, "EEE, MMM dd, yyyy")}
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Clock className="text-gray-500 w-4 h-4" />
            <p className="text-sm">
              {formatDate(fetchedEvent.eventEnd, "h:mma").toLowerCase()}
            </p>
          </div>
        </div>
        <AddressBlock address={eventDelivery} type="Delivery" />
        <AddressBlock address={eventBilling} type="Billing" />
        <div className="flex flex-col">
          <h4 className="font-semibold">Event Notes</h4>
          <p className="text-sm">{fetchedEvent?.notes}</p>
        </div>
        <div className="flex flex-col">
          <h4 className="font-semibold">Internal Notes</h4>
          <p className="text-sm">{fetchedEvent?.internalNotes}</p>
        </div>
      </div>
    </section>
  );
};

export default EventDetailsSection;
