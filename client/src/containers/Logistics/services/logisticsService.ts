export type ManifestWorkType =
  | "WarehouseLoad"
  | "WarehouseReload"
  | "WarehouseUnload"
  | "ReturnToWarehouse"
  | "Delivery"
  | "Setup"
  | "Teardown"
  | "Pickup";

export type CreateManifestWorkItemRequest = {
  workItemUid?: string | null;
  sortOrder: number;
  type: ManifestWorkType;
  eventUid?: string | null;
  specificNotes?: string | null;
};

export type CreateManifestTripRequest = {
  name: string;
  truckUid: string;
  crewLeadUid: string;
  crewUids: string[];
  scheduledStart: string;
  scheduledEnd: string;
  internalNotes?: string | null;
  workItems: CreateManifestWorkItemRequest[];
};

export const createManifestTrip = async (
  apiUrl: string,
  payload: CreateManifestTripRequest,
) => {
  const response = await fetch(`${apiUrl}/api/logistics/trips/manifest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  if (!response.ok) {
    let message = "There was a problem creating the truck run.";

    try {
      const errorBody = JSON.parse(text);
      message = errorBody.detail || errorBody.title || message;
    } catch {
      message = text || message;
    }

    throw new Error(message);
  }

  return text ? JSON.parse(text) : null;
};

const formatDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getDispatchSchedule = async (apiUrl: string, date: Date) => {
  const dateOnly = formatDateOnly(date);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const response = await fetch(`${apiUrl}/api/logistics/schedule/${dateOnly}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-user-timezone": timezone,
    },
    credentials: "include",
  });

  const text = await response.text();

  if (!response.ok) {
    let message = "There was a problem fetching the dispatch schedule.";

    try {
      const errorBody = JSON.parse(text);
      message = errorBody.detail || errorBody.title || message;
    } catch {
      message = text || message;
    }

    throw new Error(message);
  }

  return text ? JSON.parse(text) : [];
};

export const updateManifestTrip = async (
  apiUrl: string,
  runUid: string,
  payload: CreateManifestTripRequest,
) => {
  const response = await fetch(
    `${apiUrl}/api/logistics/trips/manifest/${runUid}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    },
  );

  const text = await response.text();

  if (!response.ok) {
    let message = "There was a problem updating the truck run.";

    try {
      const errorBody = JSON.parse(text);
      message = errorBody.detail || errorBody.title || message;
    } catch {
      message = text || message;
    }

    throw new Error(message);
  }

  return text ? JSON.parse(text) : null;
};

export const deleteManifestTrip = async (apiUrl: string, runUid: string) => {
  const response = await fetch(
    `${apiUrl}/api/logistics/trips/manifest/${runUid}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  const text = await response.text();

  if (!response.ok) {
    let message = "There was a problem deleting the truck run.";

    try {
      const errorBody = JSON.parse(text);
      message = errorBody.detail || errorBody.title || message;
    } catch {
      message = text || message;
    }

    throw new Error(message);
  }

  return null;
};

export type UnassignedLogisticsEvent = {
  uid: string;
  eventName: string | null;
  clientName: string;
  location: string;
  eventStart: string;
  eventEnd: string;
  missingWorkTypes: ManifestWorkType[];
};

export const getUnassignedLogisticsEvents = async (
  apiUrl: string,
  date: Date,
): Promise<UnassignedLogisticsEvent[]> => {
  const dateOnly = formatDateOnly(date);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const response = await fetch(
    `${apiUrl}/api/logistics/unassigned-events/${dateOnly}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-user-timezone": timezone,
      },
      credentials: "include",
    },
  );

  const text = await response.text();

  if (!response.ok) {
    let message = "There was a problem fetching unassigned events.";

    try {
      const errorBody = JSON.parse(text);
      message = errorBody.detail || errorBody.title || message;
    } catch {
      message = text || message;
    }

    throw new Error(message);
  }

  return text ? JSON.parse(text) : [];
};
