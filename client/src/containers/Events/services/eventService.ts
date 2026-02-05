import type { CreateEventInputs, ItemBasics } from "../CreateEvent/CreateEvent";
import { CustomError } from "../../../types/CustomError";
import type { PaginatedResponse } from "../../../types/PaginatedResponse";
import type { Event, EventDraftResponse } from "../types/Event";

const fetchEvents = async (
  apiUrl: string,
  page: number,
): Promise<PaginatedResponse<Event>> => {
  const response = await fetch(
    `${apiUrl}/api/events?page=${page}&pageSize=25`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Getting events failed.", errorData);
  }

  return await response.json();
};

const getEventDetails = async (apiUrl: string, uid: string): Promise<Event> => {
  const response = await fetch(`${apiUrl}/api/events/${uid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Getting event failed");
  }

  return await response.json();
};

const saveEvent = async (
  apiUrl: string,
  data: CreateEventInputs,
  formattedStartDateTime: string,
  formattedEndDateTime: string,
  items: ItemBasics[],
  uids: { clientUid: string; billingUid: string; deliveryUid: string },
  eventUid: string | null,
  action: "draft" | "reserve" | "update",
): Promise<EventDraftResponse> => {
  let url = "";
  let method = eventUid ? "PATCH" : "POST";

  if (action === "reserve") {
    url = `${apiUrl}/api/events/reserve`;
    method = "POST";
  } else if (action === "update") {
    url = `${apiUrl}/api/events/update/${eventUid}`;
    method = "PATCH";
  } else {
    url = `${apiUrl}/api/events/save-draft`;
    method = "POST";
  }

  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      eventUid,
      clientUid: uids.clientUid,
      eventName: data.eventName,
      eventStart: formattedStartDateTime,
      eventEnd: formattedEndDateTime,
      billingAddress: uids.billingUid,
      deliveryAddress: uids.deliveryUid,
      eventType: data.eventType,
      notes: data.eventNotes,
      internalNotes: data.internalNotes,
      items,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Saving event failed");
  }

  return await response.json();
};

const changeEventStatus = async (
  apiUrl: string,
  uid: string,
  status: string,
): Promise<null> => {
  const response = await fetch(`${apiUrl}/api/events/${status}/${uid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Changing event status failed.");
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json();
};

export { fetchEvents, saveEvent, getEventDetails, changeEventStatus };
