import ActionButton from "../../../components/common/ActionButton";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useEventDetails } from "../hooks/useEventDetails";
import { useNavigate } from "react-router";
import EventDetailsTotals from "./components/EventDetailsTotals";
import EventItems from "./components/EventItems";
import ClientDetails from "./components/ClientDetails";
import EventDetailsSection from "./components/EventDetailsSection";
import TaskAssignment from "./components/TaskAssignment";
import { useState, useEffect } from "react";
import LogisticsModal from "../../../components/common/LogisticsModal";
import AddTaskForm from "./components/AddTaskForm";
import type { CrewPreset } from "../types/CrewPreset";
import { getCrewPresets } from "../services/crewService";
import AddModal from "../../../components/common/AddModal";
import SplitTaskModal from "./components/SplitTaskModal";
import DeleteTaskModal from "./components/DeleteTaskModal";

export type EditEventModalType =
  | "addTask"
  | "confirmSplit"
  | "deleteTask"
  | null;

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const EventDetails: React.FC = () => {
  const { fetchedEvent, isLoading } = useEventDetails();
  const [openModal, setOpenModal] = useState<EditEventModalType>(null);
  const [taskType, setTaskType] = useState<string | null>(null);
  const [crewPresets, setCrewPresets] = useState<CrewPreset[]>([]);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);

  const fetchCrewPresets = async () => {
    try {
      const crewPresets = await getCrewPresets(apiUrl);
      setCrewPresets(crewPresets);
    } catch (err) {
      console.error("Error fetching active trucks:", err);
    }
  };

  useEffect(() => {
    fetchCrewPresets();
  }, []);

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
      {openModal === "addTask" && (
        <LogisticsModal<EditEventModalType>
          openModal={openModal}
          setOpenModal={setOpenModal}
          title={`Add ${taskType} Crew`}
          modalKey="addTask"
        >
          <AddTaskForm
            taskType={taskType}
            crewPresets={crewPresets}
            setOpenModal={setOpenModal}
          />
        </LogisticsModal>
      )}
      {openModal === "deleteTask" && (
        <AddModal<EditEventModalType>
          openModal={openModal}
          setOpenModal={setOpenModal}
          title="Delete Task"
          modalKey="deleteTask"
        >
          <DeleteTaskModal
            taskToDelete={selectedTask}
            setOpenModal={setOpenModal}
          />
        </AddModal>
      )}
      {openModal === "confirmSplit" && (
        <AddModal<EditEventModalType>
          openModal={openModal}
          setOpenModal={setOpenModal}
          title="Confirm Task Split"
          modalKey="confirmSplit"
        >
          <SplitTaskModal
            taskToSplit={selectedTask}
            setOpenModal={setOpenModal}
          />
        </AddModal>
      )}
      <section className="flex flex-row justify-between items-center">
        <h2 className="text-2xl font-semibold text-primary">
          {fetchedEvent.eventName}
        </h2>
        <ActionButton
          label="Edit Event"
          onClick={() => {
            navigate(
              `/events/create?clientId=${fetchedEvent.clientUid}&eventId=${fetchedEvent.uid}`,
            );
          }}
          style="outline"
        />
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
            setOpenModal={setOpenModal}
            setTaskType={setTaskType}
            setSelectedTask={setSelectedTask}
          />
        </div>
      </section>
    </main>
  );
};

export default EventDetails;
