import { formatDate } from "date-fns";
import { SquareArrowOutUpRight } from "lucide-react";
import { useNavigate } from "react-router";
import type { LogisticsTrip } from "../../types/Event";

interface TripCardProps {
  trip: LogisticsTrip;
  eventUid: string | null;
}

const TripCard: React.FC<TripCardProps> = ({ trip, eventUid }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col py-2 px-4 rounded-xl bg-gray-50 outline-1 outline-gray-200">
      <div className="flex justify-between items-center">
        <p className="font-semibold">
          {formatDate(trip.scheduledStart, "h:mm a")} -{" "}
          {formatDate(trip.scheduledEnd, "h:mm a")}
        </p>
        {eventUid !== trip.deliveryDetails.eventUid && (
          <button
            title="Go to Event"
            onClick={() => navigate(`/events/${trip.deliveryDetails.eventUid}`)}
            className="text-gray-500 hover:text-primary transition-colors duration-200 hover:cursor-pointer"
          >
            <SquareArrowOutUpRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="text-sm">{trip.tripSummary}</p>
      <p className="text-xs">
        {trip.deliveryDetails.city}, {trip.deliveryDetails.state}
      </p>
      <p className="text-xs text-gray-400">{trip.deliveryDetails.eventName}</p>
    </div>
  );
};

export default TripCard;
