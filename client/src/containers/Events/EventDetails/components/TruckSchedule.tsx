import { formatDate } from "date-fns";
import type { Truck } from "../../types/Logistics";
import { useState, useEffect } from "react";
import { getTruckSchedule } from "../../services/logisticsService";
import type { LogisticsTrip } from "../../types/Event";
import LoadingSpinner from "../../../../components/common/LoadingSpinner";
import { SquareArrowOutUpRight } from "lucide-react";
import { useNavigate } from "react-router";
import TripCard from "./TripCard";

interface TruckScheduleProps {
  truck: string;
  trucks: Truck[];
  taskStartDate: Date;
  eventUid: string | null;
}

const TruckSchedule: React.FC<TruckScheduleProps> = ({
  truck,
  trucks,
  taskStartDate,
  eventUid,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [trips, setTrips] = useState<LogisticsTrip[]>([]);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const navigate = useNavigate();

  const fetchTruckSchedule = async (truckUid: string, date: Date) => {
    try {
      if (!truckUid || !date) return;
      // setErrors(null);
      setIsLoading(true);
      const offset = date.getTimezoneOffset();
      const localDate = new Date(date.getTime() - offset * 60 * 1000);
      const formattedDate = localDate.toISOString().split("T")[0];
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const trips = await getTruckSchedule(
        apiUrl,
        truckUid,
        formattedDate,
        userTimezone,
      );
      setTrips(trips);
      console.log(trips);
      setIsLoading(false);
    } catch (err) {
      // handleError(err, setErrors);
    }
  };

  useEffect(() => {
    fetchTruckSchedule(truck, taskStartDate);
  }, [truck, taskStartDate]);

  if (isLoading) {
    return (
      <div className="flex flex-col border-l border-gray-200 px-8 h-full">
        <div className="flex justify-center items-center w-full h-full">
          <LoadingSpinner dimensions={{ x: 6, y: 6 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col border-l border-gray-200 pb-4 h-0 min-h-full overflow-scroll">
      {truck ? (
        <>
          <div className="flex flex-col items-baseline pt-4 pb-2 mb-2 sticky top-0 bg-white w-full px-8">
            <div className="text-xs text-gray-500">
              {formatDate(taskStartDate, "MM/dd/yyyy")}
            </div>
            <h4 className="font-semibold">
              {trucks.find((t) => t.uid === truck)?.name} Schedule
            </h4>
          </div>
          <div className="flex flex-col gap-4 flex-1 px-8">
            {trips.map((t) => (
              <TripCard key={t.uid} trip={t} eventUid={eventUid} />
            ))}
            {trips.length === 0 && (
              <div className="flex flex-col flex-1 justify-center items-center text-center">
                <div className="text-sm font-medium text-gray-400 max-w-[150px]">
                  No trips scheduled for this day
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col flex-1 justify-center items-center text-center">
          <div className="text-sm font-medium text-gray-400 max-w-[150px]">
            Please select a truck to view schedule
          </div>
        </div>
      )}
    </div>
  );
};

export default TruckSchedule;
