import { Route } from "lucide-react";
import { formatDate } from "date-fns";
import { useNavigate } from "react-router";
import ActionButton from "../../../../components/common/ActionButton";
import ChipTag from "../../../../components/common/ChipTag";
import { useEventDetails } from "../../hooks/useEventDetails";
import type { LogisticsTrip } from "../../types/Event";

type LogisticsWorkType = "Delivery" | "Setup" | "Teardown" | "Pickup";

type EventLogisticsRun = {
  trip: LogisticsTrip;
  eventItems: {
    name?: string;
    uid: string;
    type: LogisticsWorkType;
    status?: string;
    sortOrder?: number;
  }[];
};

const logisticsWorkTypes: LogisticsWorkType[] = [
  "Delivery",
  "Setup",
  "Teardown",
  "Pickup",
];

const workTypeLabels: Record<LogisticsWorkType, string> = {
  Delivery: "Delivery",
  Setup: "Setup",
  Teardown: "Teardown",
  Pickup: "Pickup",
};

const statusColorMap: Record<
  string,
  "gray" | "blue" | "green" | "orange" | "red"
> = {
  Pending: "gray",
  InProgress: "blue",
  Arrived: "blue",
  Completed: "green",
  Skipped: "orange",
  Cancelled: "red",
};

const EventLogisticsPanel: React.FC = () => {
  const { fetchedEvent } = useEventDetails();
  const navigate = useNavigate();

  const trips = fetchedEvent?.logisticsTrips ?? [];

  const logisticsRuns: EventLogisticsRun[] = trips
    .map((trip) => {
      const eventItems =
        trip.workItems
          ?.filter((item) =>
            logisticsWorkTypes.includes(item.type as LogisticsWorkType),
          )
          .map((item) => ({
            uid: item.uid,
            type: item.type as LogisticsWorkType,
            status: item.status,
            sortOrder: item.sortOrder,
          })) ?? [];

      return {
        trip,
        eventItems,
      };
    })
    .filter((run) => run.eventItems.length > 0);

  return (
    <section className="flex flex-col border-1 border-gray-200 rounded-lg py-4 px-6 gap-4 h-full min-h-0 overflow-hidden">
      <div className="flex justify-between items-start shrink-0">
        <div>
          <h3 className="text-lg font-semibold text-primary">Logistics</h3>
          <p className="text-xs text-gray-400">
            Scheduled delivery, setup, teardown, and pickup.
          </p>
        </div>

        <ActionButton
          label="Dispatch Board"
          icon={Route}
          style="outline"
          onClick={() => navigate("/logistics")}
        />
      </div>

      <div className="flex flex-col gap-2 min-h-0 overflow-y-auto pr-1">
        {logisticsRuns.length === 0 ? (
          <div className="rounded-lg border-1 border-dashed border-gray-300 bg-gray-50 px-3 py-3">
            <p className="text-sm font-semibold">No logistics scheduled</p>
            <p className="text-xs text-gray-400">
              This event has not been placed on a truck run yet.
            </p>
          </div>
        ) : (
          logisticsRuns.map((run) => {
            const statuses = run.eventItems.map(
              (item) => item.status ?? "Pending",
            );
            const primaryStatus = statuses.includes("InProgress")
              ? "InProgress"
              : statuses.includes("Arrived")
                ? "Arrived"
                : statuses.every((status) => status === "Completed")
                  ? "Completed"
                  : statuses.includes("Cancelled")
                    ? "Cancelled"
                    : "Pending";

            const statusColor = statusColorMap[primaryStatus] ?? "gray";

            const taskLabel = run.eventItems
              .map((item) => workTypeLabels[item.type])
              .join(" / ");

            const stopLabel = run.eventItems
              .map((item) => item.sortOrder)
              .filter(Boolean)
              .map((sortOrder) => `#${sortOrder}`)
              .join(", ");

            return (
              <div
                key={run.trip.uid}
                className="grid grid-cols-[1fr_auto] gap-3 items-center rounded-lg border-1 border-gray-200 bg-gray-50 px-3 py-2"
              >
                <div className="flex flex-col min-w-0">
                  <div className="flex gap-2 items-baseline min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {taskLabel}
                    </p>

                    {stopLabel && (
                      <p className="text-xs text-gray-400 shrink-0">
                        Stops {stopLabel}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-gray-500 truncate">
                    {run.trip.name || "Truck Run"}
                  </p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                    <span>{run.trip.truckName}</span>
                    <span>{run.trip.crewLeadName || "No lead"}</span>
                    <span>{formatDate(run.trip.scheduledStart, "MMM d")}</span>
                    <span>
                      {formatDate(
                        run.trip.scheduledStart,
                        "h:mma",
                      ).toLowerCase()}{" "}
                      -{" "}
                      {formatDate(run.trip.scheduledEnd, "h:mma").toLowerCase()}
                    </span>
                  </div>
                </div>

                <ChipTag label={primaryStatus} color={statusColor} />
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default EventLogisticsPanel;
