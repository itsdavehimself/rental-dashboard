import {
  ArrowRight,
  Calendar1,
  Clock,
  PenSquare,
  Trash,
  Truck,
  UserRoundPen,
} from "lucide-react";
import type { LogisticsTrip } from "../../types/Event";
import { formatDate } from "date-fns";
import type { EditEventModalType } from "../EventDetails";

interface CrewSectionProps {
  label: string;
  isSplit?: boolean;
  splitLabel?: string;
  combinedLabel?: string;
  setOpenModal: React.Dispatch<React.SetStateAction<EditEventModalType>>;
  setTaskType: React.Dispatch<React.SetStateAction<string | null>>;
  trip?: LogisticsTrip;
  setSelectedTask: React.Dispatch<React.SetStateAction<string | null>>;
  setTaskDetails: React.Dispatch<React.SetStateAction<LogisticsTrip | null>>;
}

const CrewSection: React.FC<CrewSectionProps> = ({
  label,
  isSplit,
  splitLabel,
  combinedLabel,
  setOpenModal,
  setTaskType,
  trip,
  setSelectedTask,
  setTaskDetails,
}) => {
  const taskName = isSplit ? (splitLabel ?? label) : (combinedLabel ?? label);

  return (
    <div className="flex flex-col gap-2 w-full">
      {!trip ? (
        <>
          <div className="flex gap-4 items-baseline">
            <p className="text-sm font-semibold">{taskName}</p>
          </div>
          <button
            onClick={() => {
              setOpenModal("addTask");
              setTaskType(taskName);
            }}
            className="flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-primary transition-all duration-200 cursor-pointer w-fit"
          >
            <UserRoundPen className="h-4 w-4" />
            Assign Crew
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-4 border-1 py-2 px-4 rounded-lg border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{trip.tripSummary}</h3>
            <div className="flex gap-2 items-center">
              <Truck className="text-gray-500 w-4 h-4" />
              <p className="text-sm font-semibold">{trip.truckName}</p>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-1">
            <div className="flex gap-2 items-center">
              <Calendar1 className="text-gray-500 w-4 h-4" />
              <p className="text-sm">
                {formatDate(trip.scheduledStart, "EEE, MMM dd, yyyy")}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <Clock className="text-gray-500 w-4 h-4" />
              <div className="flex gap-2 items-center">
                <p className="text-sm">
                  {formatDate(trip.scheduledStart, "h:mma").toLowerCase()}
                </p>
                <ArrowRight className="h-3 w-3" />
                <p className="text-sm">
                  {formatDate(trip.scheduledEnd, "h:mma").toLowerCase()}
                </p>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <div className="flex gap-1">
                <h5 className="font-semibold text-sm">Lead:</h5>
                <p className="text-sm">{trip.crewLeadName}</p>
              </div>
              <div className="flex gap-1">
                <h5 className="font-semibold text-sm">Crew:</h5>
                <p className="text-sm">
                  {trip.crew
                    .filter((c) => !c.isLead)
                    .map((c, index, array) => (
                      <span key={c.uid}>
                        {c.fullName}
                        {index < array.length - 1 ? ", " : ""}
                      </span>
                    ))}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="text-gray-500 hover:text-primary transition-all duration-200 hover:cursor-pointer">
                <PenSquare
                  onClick={() => {
                    setSelectedTask(trip.uid);
                    setTaskDetails(trip);
                    setOpenModal("editTask");
                  }}
                  className="h-4 w-4"
                />
              </button>
              <button
                onClick={() => {
                  setSelectedTask(trip.uid);
                  setOpenModal("deleteTask");
                }}
                className="text-gray-500 hover:text-primary transition-all duration-200 hover:cursor-pointer"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrewSection;
