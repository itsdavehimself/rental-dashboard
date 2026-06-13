import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import ActionButton from "../../components/common/ActionButton";
import DatePicker from "../../components/common/DatePicker";
import RunCard, {
  type DispatchRun,
  type LogisticsWorkType,
} from "./components/RunCard";
import RunManifestPanel from "./components/RunManifestPanel";
import AddModal from "../../components/common/AddModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { openModal } from "../../app/slices/uiSlice";
import NewRunForm from "./components/NewRunForm";
import {
  deleteManifestTrip,
  getDispatchSchedule,
} from "./components/services/logisticsService";
import { useToast } from "../../hooks/useToast";
import DeleteModal from "../../components/common/DeleteModal";

export type LogisticsModalType = null | "addRun" | "editRun";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const Logistics: React.FC = () => {
  const [runs, setRuns] = useState<DispatchRun[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [isLoadingRuns, setIsLoadingRuns] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"default" | "edit" | "add" | "delete">(
    "default",
  );
  const { addToast } = useToast();

  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const dispatch = useAppDispatch();

  const selectedRun = useMemo(() => {
    return runs.find((run) => run.id === selectedRunId) ?? null;
  }, [runs, selectedRunId]);

  const fetchDispatchSchedule = async (date: Date) => {
    try {
      setIsLoadingRuns(true);

      const schedule = await getDispatchSchedule(apiUrl, date);
      const normalizedRuns = schedule.map(normalizeCreatedRun);

      setRuns(normalizedRuns);

      setSelectedRunId((currentId) => {
        const stillExists = normalizedRuns.some(
          (run: DispatchRun) => run.id === currentId,
        );

        if (stillExists) return currentId;

        return normalizedRuns[0]?.id ?? null;
      });
    } catch (err) {
      console.error("Error fetching dispatch schedule:", err);

      if (err instanceof Error) {
        addToast("Error", err.message);
      } else {
        addToast(
          "Error",
          "There was a problem fetching the dispatch schedule.",
        );
      }
    } finally {
      setIsLoadingRuns(false);
    }
  };

  useEffect(() => {
    fetchDispatchSchedule(selectedDate);
  }, [selectedDate]);

  const normalizeCreatedRun = (createdRun: any): DispatchRun => {
    const lead = createdRun.crew?.find((c: any) => c.isLead);
    const crew = createdRun.crew?.filter((c: any) => !c.isLead) ?? [];

    return {
      id: createdRun.uid,
      title: createdRun.name,

      truckUid: createdRun.truckUid,
      truckName: createdRun.truckName,

      crewLeadUid: lead?.userUid,
      crewLead: lead?.fullName ?? "Unassigned",

      crew: crew.map((c: any) => c.fullName),
      crewUids: crew.map((c: any) => c.userUid),

      scheduledStartUtc: createdRun.scheduledStart,
      scheduledEndUtc: createdRun.scheduledEnd,

      scheduledStart: new Date(createdRun.scheduledStart).toLocaleTimeString(
        [],
        {
          hour: "numeric",
          minute: "2-digit",
        },
      ),
      scheduledEnd: new Date(createdRun.scheduledEnd).toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      }),

      status: createdRun.status,
      items:
        createdRun.workItems?.map((item: any) => ({
          id: item.uid,
          sortOrder: item.sortOrder,
          type: item.type as LogisticsWorkType,
          eventUid: item.eventUid ?? null,
          eventName: item.eventName ?? undefined,
          location: item.location ?? undefined,
        })) ?? [],
    };
  };

  const handleDeleteRun = async () => {
    if (!selectedRun) return;

    try {
      await deleteManifestTrip(apiUrl, selectedRun.id);

      const nextRuns = runs.filter((run) => run.id !== selectedRun.id);

      setRuns(nextRuns);
      setSelectedRunId(nextRuns[0]?.id ?? null);
      setView("default");

      addToast("Success", "Truck run deleted.");
    } catch (err) {
      if (err instanceof Error) {
        addToast("Error", err.message);
      } else {
        addToast("Error", "There was a problem deleting the truck run.");
      }
    }
  };

  return (
    <>
      {activeModal === "addRun" && (
        <AddModal title="New Truck Run" modalKey="addRun">
          <NewRunForm
            onRunCreated={(createdRun) => {
              const normalizedRun = normalizeCreatedRun(createdRun);

              setRuns((prev) => [...prev, normalizedRun]);
              setSelectedRunId(normalizedRun.id);
            }}
          />
        </AddModal>
      )}
      {activeModal === "editRun" && selectedRun && (
        <AddModal title="Edit Truck Run" modalKey="editRun">
          <NewRunForm
            mode="edit"
            initialRun={selectedRun}
            onRunUpdated={(updatedRun) => {
              const normalizedRun = normalizeCreatedRun(updatedRun);

              setRuns((prev) =>
                prev.map((run) =>
                  run.id === normalizedRun.id ? normalizedRun : run,
                ),
              );

              setSelectedRunId(normalizedRun.id);
            }}
          />
        </AddModal>
      )}
      {view === "delete" && selectedRun && (
        <DeleteModal
          title="Delete Truck Run"
          label={`truck run "${selectedRun.title}"`}
          setView={setView}
          cancelAction={() => setView("default")}
          deleteAction={handleDeleteRun}
        />
      )}
      <div className="flex flex-col bg-white h-screen w-full rounded-3xl p-8 gap-6 overflow-hidden">
        <div className="flex justify-between items-center">
          <h2 className="self-start text-2xl font-semibold">Logistics</h2>

          <ActionButton
            label="New Run"
            icon={Plus}
            style="filled"
            onClick={() => dispatch(openModal("addRun"))}
          />
        </div>

        <section className="grid grid-cols-[280px_1fr_1.25fr] gap-6 h-full min-h-0">
          <aside className="flex flex-col gap-4 border-1 border-gray-200 rounded-xl py-4 px-6">
            <div className="flex gap-2 items-center">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <h3 className="font-semibold text-lg">Schedule</h3>
            </div>

            <DatePicker
              label="Dispatch Date"
              date={selectedDate}
              onSelect={(val) => setSelectedDate(val)}
              disablePastDates={false}
            />

            <div className="flex flex-col gap-2 pt-2">
              <h4 className="text-sm font-semibold">Summary</h4>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col rounded-xl bg-gray-50 border-1 border-gray-200 p-3">
                  <span className="text-xs text-gray-500">Runs</span>
                  <span className="font-semibold">{runs.length}</span>
                </div>

                <div className="flex flex-col rounded-xl bg-gray-50 border-1 border-gray-200 p-3">
                  <span className="text-xs text-gray-500">Stops</span>
                  <span className="font-semibold">
                    {runs.reduce((total, run) => total + run.items.length, 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 min-h-0">
              <h4 className="text-sm font-semibold">Unassigned Events</h4>

              <div className="flex flex-1 justify-center items-center text-sm text-gray-400 text-center border-1 border-dashed border-gray-300 rounded-xl p-4">
                Later this will show confirmed events that still need delivery,
                setup, teardown, or pickup.
              </div>
            </div>
          </aside>

          <section className="flex flex-col gap-4 border-1 border-gray-200 rounded-xl py-4 px-6 overflow-hidden">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Truck Runs</h3>
              <span className="text-sm text-gray-400">
                {runs.length} scheduled
              </span>
            </div>

            <div className="flex flex-col gap-3 overflow-scroll pr-1">
              {isLoadingRuns ? (
                <div className="rounded-xl border-1 border-dashed border-gray-300 p-4 text-sm text-gray-400 text-center">
                  Loading dispatch schedule...
                </div>
              ) : runs.length === 0 ? (
                <div className="rounded-xl border-1 border-dashed border-gray-300 p-4 text-sm text-gray-400 text-center">
                  No truck runs scheduled for this date.
                </div>
              ) : (
                runs.map((run) => (
                  <RunCard
                    key={run.id}
                    run={run}
                    isSelected={selectedRunId === run.id}
                    onSelect={setSelectedRunId}
                  />
                ))
              )}
            </div>
          </section>

          <RunManifestPanel
            selectedRun={selectedRun}
            onEditRun={() => {
              if (!selectedRun) return;
              dispatch(openModal("editRun"));
            }}
            onDeleteRun={() => {
              if (!selectedRun) return;
              setView("delete");
            }}
          />
        </section>
      </div>
    </>
  );
};

export default Logistics;
