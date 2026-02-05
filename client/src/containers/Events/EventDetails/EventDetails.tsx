import ActionButton from "../../../components/common/ActionButton";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useEventDetails } from "../hooks/useEventDetails";
import { useNavigate } from "react-router";
import EventDetailsTotals from "./components/EventDetailsTotals";
import EventItems from "./components/EventItems";
import ClientDetails from "./components/ClientDetails";
import EventDetailsSection from "./components/EventDetailsSection";
import TaskAssignment from "./components/TaskAssignment";
import { useState, useEffect, useRef } from "react";
import LogisticsModal from "../../../components/common/LogisticsModal";
import AddTaskForm from "./components/AddTaskForm";
import type { CrewPreset } from "../types/CrewPreset";
import { getCrewPresets } from "../services/crewService";
import AddModal from "../../../components/common/AddModal";
import SplitTaskModal from "./components/SplitTaskModal";
import DeleteTaskModal from "./components/DeleteTaskModal";
import type { LogisticsTrip } from "../types/Event";
import { useAppSelector } from "../../../app/hooks";
import TransactionModal from "../CreateEvent/components/TransactionModal";
import EditModal from "../../../components/common/EditModal";
import ChipTag from "../../../components/common/ChipTag";
import TAG_COLOR_MAP from "../../../config/TAG_COLOR_MAP";
import { Ban, CirclePause, Ellipsis } from "lucide-react";
import PopOver from "../../../components/common/PopOver";
import { changeEventStatus } from "../services/eventService";
import { useToast } from "../../../hooks/useToast";

export type EditEventModalType =
  | "addTask"
  | "confirmSplit"
  | "deleteTask"
  | "editTask"
  | null;

type TagColor = keyof typeof TAG_COLOR_MAP;

const statusMap: Record<string, { label: string; color: TagColor }> = {
  Draft: { label: "Draft", color: "gray" },
  OnHold: { label: "On Hold", color: "orange" },
  Confirmed: { label: "Confirmed", color: "blue" },
  Scheduled: { label: "Scheduled", color: "indigo" },
  Completed: { label: "Completed", color: "green" },
  Cancelled: { label: "Cancelled", color: "red" },
};

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const EventDetails: React.FC = () => {
  const { fetchedEvent, isLoading, fetchEvent } = useEventDetails();
  const [taskType, setTaskType] = useState<string | null>(null);
  const [crewPresets, setCrewPresets] = useState<CrewPreset[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [taskDetails, setTaskDetails] = useState<LogisticsTrip | null>(null);
  const [popOverOpen, setPopOverOpen] = useState<boolean>(false);

  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const activeModal = useAppSelector((state) => state.ui.activeModal);

  const { addToast } = useToast();

  const fetchCrewPresets = async () => {
    try {
      const crewPresets = await getCrewPresets(apiUrl);
      setCrewPresets(crewPresets);
    } catch (err) {
      console.error("Error fetching active trucks:", err);
    }
  };

  const handleEventStatusChange = async (
    eventUid: string | null,
    status: string,
  ) => {
    if (!eventUid) return;

    try {
      // setErrors(null);
      await changeEventStatus(apiUrl, eventUid, status);
      const statusLabel = statusMap[status]?.label || status;
      addToast(
        "Success",
        `Event status successfully changed to ${statusLabel}.`,
      );
      fetchEvent();
    } catch (err) {
      // handleError(err, setErrors);
    }
  };

  useEffect(() => {
    fetchCrewPresets();
  }, []);

  useEffect(() => {
    if (!popOverOpen) return;

    const close = (e: MouseEvent) => {
      if (buttonRef.current?.contains(e.target as Node)) return;
      setPopOverOpen(false);
    };

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [popOverOpen]);

  useEffect(() => {
    if (!popOverOpen) return;

    function handleScroll() {
      setPopOverOpen(false);
    }

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [popOverOpen]);

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6 justify-center items-center">
        <div className="flex justify-center items-center w-full text-sm text-gray-400 h-10">
          <LoadingSpinner dimensions={{ x: 10, y: 10 }} />
        </div>
      </div>
    );
  }

  if (!fetchedEvent) {
    navigate("/dashboard");
    return;
  }

  return (
    <main className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      {popOverOpen && anchorRect && (
        <PopOver
          anchorRect={anchorRect}
          onClose={() => setPopOverOpen(false)}
          buttons={[
            {
              icon: CirclePause,
              label: "Hold Event",
              onClick: () => {
                handleEventStatusChange(fetchedEvent.uid, "onhold");
              },
            },
            {
              icon: Ban,
              label: "Cancel Event",
              onClick: () => {
                handleEventStatusChange(fetchedEvent.uid, "cancelled");
              },
              danger: true,
            },
          ]}
        />
      )}
      {activeModal === "addTask" && (
        <LogisticsModal<EditEventModalType>
          title={`Add ${taskType} Task`}
          modalKey="addTask"
        >
          <AddTaskForm taskType={taskType} crewPresets={crewPresets} />
        </LogisticsModal>
      )}
      {activeModal === "editTask" && (
        <LogisticsModal<EditEventModalType>
          title={`Edit ${taskType} Task`}
          modalKey="editTask"
        >
          <AddTaskForm
            taskType={taskType}
            crewPresets={crewPresets}
            taskDetails={taskDetails}
          />
        </LogisticsModal>
      )}
      {activeModal === "deleteTask" && (
        <AddModal<EditEventModalType> title="Delete Task" modalKey="deleteTask">
          <DeleteTaskModal taskToDelete={selectedTask} />
        </AddModal>
      )}
      {activeModal === "confirmSplit" && (
        <AddModal<EditEventModalType>
          title="Confirm Task Split"
          modalKey="confirmSplit"
        >
          <SplitTaskModal taskToSplit={selectedTask} />
        </AddModal>
      )}
      {activeModal === "payments" && (
        <EditModal
          children={
            <TransactionModal cancelled={fetchedEvent.status === "Cancelled"} />
          }
        />
      )}
      <section className="flex flex-row justify-between items-center">
        <div className="flex gap-4 items-center justify-end">
          <h2 className="text-2xl font-semibold text-primary">
            {fetchedEvent.eventName}
          </h2>
          <ChipTag
            label={statusMap[fetchedEvent.status].label}
            color={statusMap[fetchedEvent.status].color}
          />
        </div>
        <div className="flex gap-4">
          {fetchedEvent.status !== "Cancelled" && (
            <>
              <ActionButton
                label="Edit Event"
                onClick={() => {
                  navigate(
                    `/events/create?clientId=${fetchedEvent.clientUid}&eventId=${fetchedEvent.uid}`,
                  );
                }}
                style="outline"
              />

              <ActionButton
                ref={buttonRef}
                icon={Ellipsis}
                label=""
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setAnchorRect(rect);
                  setPopOverOpen((prev) => !prev);
                }}
                style="outline"
              />
            </>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-4 h-full flex-1">
        <div className="grid grid-cols-[1fr_2fr] gap-4">
          <EventDetailsSection />
          <div className="grid grid-cols-[2fr_1fr] gap-4">
            <EventItems />
            <EventDetailsTotals />
          </div>
        </div>
        <div className="grid grid-cols-[1fr_2fr] gap-4 h-full">
          <ClientDetails />
          <TaskAssignment
            setTaskType={setTaskType}
            setSelectedTask={setSelectedTask}
            setTaskDetails={setTaskDetails}
          />
        </div>
      </section>
    </main>
  );
};

export default EventDetails;
