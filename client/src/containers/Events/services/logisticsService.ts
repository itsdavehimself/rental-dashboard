import { CustomError } from "../../../types/CustomError";
import type { TaskInputs } from "../EventDetails/components/AddTaskForm";
import type { LogisticsTrip } from "../types/Event";
import type { Truck } from "../types/Logistics";

const getActiveTrucks = async (apiUrl: string): Promise<Truck[]> => {
  const response = await fetch(`${apiUrl}/api/logistics/trucks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Getting active trucks failed.", errorData);
  }

  return await response.json();
};

const createLogistics = async (
  apiUrl: string,
  eventUid: string,
  data: TaskInputs,
  startUtc: string,
  endUtc: string,
  taskType: string,
): Promise<LogisticsTrip> => {
  const response = await fetch(`${apiUrl}/api/logistics/trip`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      eventUid,
      startTime: startUtc,
      endTime: endUtc,
      crewLead: data.lead,
      crew: data.crew,
      truckUid: data.truck,
      taskType,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Saving crew failed.", errorData);
  }

  return await response.json();
};

const splitLogistics = async (
  apiUrl: string,
  taskUid: string,
): Promise<LogisticsTrip> => {
  const response = await fetch(`${apiUrl}/api/logistics/split/${taskUid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Splitting tasks failed.", errorData);
  }

  return await response.json();
};
const deleteLogistics = async (
  apiUrl: string,
  taskUid: string,
): Promise<void> => {
  const response = await fetch(`${apiUrl}/api/logistics/${taskUid}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "Unknown error" }));
    throw new CustomError("Delete task failed.", errorData);
  }

  if (
    response.status === 204 ||
    response.headers.get("Content-Length") === "0"
  ) {
    return;
  }

  try {
    return await response.json();
  } catch (e) {
    return;
  }
};

export { getActiveTrucks, createLogistics, splitLogistics, deleteLogistics };
