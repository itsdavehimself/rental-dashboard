import React, { useState, useMemo, useEffect } from "react";
import CrewSection from "./CrewSection";
import { useEventDetails } from "../../hooks/useEventDetails";
import type { EditEventModalType } from "../EventDetails";

interface TaskAssignmentProps {
  setOpenModal: React.Dispatch<React.SetStateAction<EditEventModalType>>;
  setTaskType: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedTask: React.Dispatch<React.SetStateAction<string | null>>;
}

const TaskAssignment: React.FC<TaskAssignmentProps> = ({
  setOpenModal,
  setTaskType,
  setSelectedTask,
}) => {
  const [deliverySplit, setDeliverySplit] = useState(false);
  const [pickUpSplit, setPickUpSplit] = useState(false);

  const { fetchedEvent } = useEventDetails();

  const trips = useMemo(
    () => fetchedEvent?.logisticsTrips || [],
    [fetchedEvent?.logisticsTrips],
  );

  // --- Data Selectors ---
  const preEventData = useMemo(() => {
    const combined = trips.find(
      (t) =>
        t.workItems.some((w) => w.type === "Delivery") &&
        t.workItems.some((w) => w.type === "Setup"),
    );

    const deliveryOnly = trips.find(
      (t) =>
        t.workItems.some((w) => w.type === "Delivery") &&
        !t.workItems.some((w) => w.type === "Setup"),
    );

    const setupOnly = trips.find(
      (t) =>
        t.workItems.some((w) => w.type === "Setup") &&
        !t.workItems.some((w) => w.type === "Delivery"),
    );

    return { combined, deliveryOnly, setupOnly };
  }, [trips]);

  const postEventData = useMemo(() => {
    const combined = trips.find(
      (t) =>
        t.workItems.some((w) => w.type === "Teardown") &&
        t.workItems.some((w) => w.type === "Pickup"),
    );

    const teardownOnly = trips.find(
      (t) =>
        t.workItems.some((w) => w.type === "Teardown") &&
        !t.workItems.some((w) => w.type === "Pickup"),
    );

    const pickupOnly = trips.find(
      (t) =>
        t.workItems.some((w) => w.type === "Pickup") &&
        !t.workItems.some((w) => w.type === "Teardown"),
    );

    return { combined, teardownOnly, pickupOnly };
  }, [trips]);

  // --- Auto-Sync UI with Database ---
  useEffect(() => {
    if (fetchedEvent) {
      if (preEventData.deliveryOnly || preEventData.setupOnly) {
        setDeliverySplit(true);
      }
      if (postEventData.teardownOnly || postEventData.pickupOnly) {
        setPickUpSplit(true);
      }
    }
  }, [fetchedEvent, preEventData, postEventData]);

  // --- Handlers ---
  const handlePreSplitToggle = () => {
    if (preEventData.combined) {
      setTaskType("PreEvent");
      setOpenModal("confirmSplit");
      setSelectedTask(preEventData.combined.uid);
    } else {
      setDeliverySplit(!deliverySplit);
    }
  };

  const handlePostSplitToggle = () => {
    if (postEventData.combined) {
      setTaskType("PostEvent");
      setOpenModal("confirmSplit");
      setSelectedTask(postEventData.combined.uid);
    } else {
      setPickUpSplit(!pickUpSplit);
    }
  };

  const canTogglePre = !(preEventData.deliveryOnly || preEventData.setupOnly);
  const canTogglePost = !(
    postEventData.teardownOnly || postEventData.pickupOnly
  );

  return (
    <section className="flex flex-col border-1 gap-6 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
      <h3 className="text-lg font-semibold text-primary">Task Assignment</h3>

      <div className="grid grid-cols-2 h-full gap-8">
        {/* PRE-EVENT TASKS */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-baseline">
            <h4 className="font-semibold">Pre-Event Tasks</h4>
            {canTogglePre && (
              <button
                onClick={handlePreSplitToggle}
                className="text-xs font-semibold text-gray-500 hover:cursor-pointer hover:text-primary transition-all duration-200"
              >
                {deliverySplit ? `Combine Tasks` : "Split Tasks"}
              </button>
            )}
          </div>

          <div
            className={`${deliverySplit ? "grid grid-cols-2 gap-4" : "flex"}`}
          >
            <CrewSection
              isSplit={deliverySplit}
              label={deliverySplit ? "Delivery" : "Delivery/Setup"}
              setOpenModal={setOpenModal}
              setTaskType={setTaskType}
              setSelectedTask={setSelectedTask}
              trip={
                deliverySplit
                  ? preEventData.deliveryOnly
                  : preEventData.combined
              }
            />
            {deliverySplit && (
              <CrewSection
                label="Setup"
                setOpenModal={setOpenModal}
                setTaskType={setTaskType}
                trip={preEventData.setupOnly}
                setSelectedTask={setSelectedTask}
              />
            )}
          </div>
        </div>

        {/* POST-EVENT TASKS */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-baseline">
            <h4 className="font-semibold">Post-Event Tasks</h4>
            {canTogglePost && (
              <button
                onClick={handlePostSplitToggle}
                className="text-xs font-semibold text-gray-500 hover:cursor-pointer hover:text-primary transition-all duration-200"
              >
                {pickUpSplit ? `Combine Tasks` : "Split Tasks"}
              </button>
            )}
          </div>

          <div className={`${pickUpSplit ? "grid grid-cols-2 gap-4" : "flex"}`}>
            <CrewSection
              isSplit={pickUpSplit}
              label={pickUpSplit ? "Teardown" : "Teardown/Pickup"}
              setOpenModal={setOpenModal}
              setTaskType={setTaskType}
              setSelectedTask={setSelectedTask}
              trip={
                pickUpSplit
                  ? postEventData.teardownOnly
                  : postEventData.combined
              }
            />
            {pickUpSplit && (
              <CrewSection
                label="Pickup"
                setOpenModal={setOpenModal}
                setTaskType={setTaskType}
                trip={postEventData.pickupOnly}
                setSelectedTask={setSelectedTask}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TaskAssignment;
