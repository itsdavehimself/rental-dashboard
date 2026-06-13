import { MapPin, Truck, Users } from "lucide-react";

export type LogisticsWorkType =
  | "WarehouseLoad"
  | "WarehouseReload"
  | "WarehouseUnload"
  | "ReturnToWarehouse"
  | "Delivery"
  | "Setup"
  | "Teardown"
  | "Pickup";

export type ManifestItem = {
  id: string;
  sortOrder: number;
  type: LogisticsWorkType;
  eventUid?: string | null;
  eventName?: string;
  location?: string;
};

export type DispatchRun = {
  id: string;
  title: string;

  truckUid?: string;
  truckName: string;

  crewLeadUid?: string;
  crewLead: string;

  crew: string[];
  crewUids?: string[];

  scheduledStart: string;
  scheduledEnd: string;

  scheduledStartUtc?: string;
  scheduledEndUtc?: string;

  status: "Scheduled" | "InProgress" | "Completed" | "Cancelled";
  items: ManifestItem[];
};

interface RunCardProps {
  run: DispatchRun;
  isSelected: boolean;
  onSelect: (runId: string) => void;
}

const RunCard: React.FC<RunCardProps> = ({ run, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(run.id)}
      className={`flex flex-col gap-3 text-left rounded-xl border-1 p-4 transition-all duration-200 hover:cursor-pointer ${
        isSelected
          ? "border-primary bg-sky-50"
          : "border-gray-200 bg-gray-50 hover:border-primary"
      }`}
    >
      <div className="flex justify-between gap-4">
        <div>
          <h4 className="font-semibold">{run.title}</h4>
          <p className="text-sm text-gray-500">
            {run.scheduledStart} - {run.scheduledEnd}
          </p>
        </div>

        <span className="text-xs font-semibold rounded-full bg-white border-1 border-gray-200 px-2 py-1 h-fit">
          {run.status}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-sm text-gray-500">
        <div className="flex gap-2 items-center">
          <Truck className="h-4 w-4" />
          <span>{run.truckName}</span>
        </div>

        <div className="flex gap-2 items-center">
          <Users className="h-4 w-4" />
          <span>
            {run.crewLead}
            {run.crew.length > 0 ? `, ${run.crew.join(", ")}` : ""}
          </span>
        </div>

        <div className="flex gap-2 items-center">
          <MapPin className="h-4 w-4" />
          <span>{run.items.length} manifest items</span>
        </div>
      </div>
    </button>
  );
};

export default RunCard;
