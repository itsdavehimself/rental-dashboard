import ActionButton from "../../../components/common/ActionButton";
import type { DispatchRun, LogisticsWorkType } from "./RunCard";

interface RunManifestPanelProps {
  selectedRun: DispatchRun | null;
  onEditRun: () => void;
  onDeleteRun: () => void;
}

const formatWorkType = (type: LogisticsWorkType) => {
  const labels: Record<LogisticsWorkType, string> = {
    WarehouseLoad: "Warehouse Load",
    WarehouseReload: "Warehouse Reload",
    WarehouseUnload: "Warehouse Unload",
    ReturnToWarehouse: "Return to Warehouse",
    Delivery: "Delivery",
    Setup: "Setup",
    Teardown: "Teardown",
    Pickup: "Pickup",
  };

  return labels[type];
};

const RunManifestPanel: React.FC<RunManifestPanelProps> = ({
  selectedRun,
  onEditRun,
  onDeleteRun,
}) => {
  if (!selectedRun) {
    return (
      <section className="flex flex-col gap-4 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
        <div className="flex justify-center items-center h-full text-sm text-gray-400">
          Select a run to view its manifest.
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{selectedRun.title}</h3>
          <p className="text-sm text-gray-500">
            {selectedRun.truckName} · {selectedRun.scheduledStart} -{" "}
            {selectedRun.scheduledEnd}
          </p>
        </div>
        <div className="flex gap-2">
          <ActionButton label="Edit Run" style="outline" onClick={onEditRun} />
          <ActionButton
            label="Delete Run"
            style="outline"
            onClick={onDeleteRun}
            type="delete"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-scroll pr-1">
        {selectedRun.items
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2rem_1fr] gap-3 rounded-lg border-1 border-gray-200 bg-gray-50 p-3"
            >
              <div className="flex justify-center items-center h-8 w-8 rounded-full bg-white border-1 border-gray-200 text-sm font-semibold">
                {item.sortOrder}
              </div>

              <div className="flex flex-col">
                <p className="font-semibold">{formatWorkType(item.type)}</p>

                {item.eventName ? (
                  <>
                    <p className="text-sm text-gray-500">{item.eventName}</p>
                    <p className="text-xs text-gray-400">{item.location}</p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400">Warehouse task</p>
                )}
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default RunManifestPanel;
