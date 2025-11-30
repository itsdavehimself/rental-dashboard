import type { CreateEventInputs, ItemBasics } from "../CreateEvent/CreateEvent";
import { CustomError } from "../../../types/CustomError";
import type { PaginatedResponse } from "../../../types/PaginatedResponse";
import type { Event, EventDraftResponse } from "../types/Event";

const fetchEvents = async (
  apiUrl: string,
  page: number
): Promise<PaginatedResponse<Event>> => {
  const response = await fetch(
    `${apiUrl}/api/events?page=${page}&pageSize=25`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
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
    throw new CustomError("Getting event failed.", errorData);
  }

  return await response.json();
};

const upsertEventDraft = async (
  apiUrl: string,
  data: CreateEventInputs,
  items: ItemBasics[],
  uids: { clientUid: string; billingUid: string; deliveryUid: string },
  eventUid: string | null
): Promise<EventDraftResponse> => {
  const method = eventUid ? "PATCH" : "POST";
  const url = eventUid
    ? `${apiUrl}/api/events/save-draft/${eventUid}`
    : `${apiUrl}/api/events/save-draft`;

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      clientUid: uids.clientUid,
      eventName: data.eventName,
      deliveryDate: data.deliveryDate,
      deliveryTime: data.deliveryTime,
      pickupDate: data.pickUpDate,
      pickupTime: data.pickUpTime,
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
    throw new CustomError(
      eventUid ? "Updating event draft failed." : "Saving event draft failed.",
      errorData
    );
  }

  return await response.json();
};

export { fetchEvents, upsertEventDraft, getEventDetails };
