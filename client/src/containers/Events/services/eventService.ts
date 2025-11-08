import type { CreateEventInputs, ItemBasics } from "../CreateEvent/CreateEvent";
import { CustomError } from "../../../types/CustomError";
import type { Client } from "../../Clients/types/Client";
import type { PaginatedResponse } from "../../../types/PaginatedResponse";
import type { Event } from "../types/Event";

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

const saveEventDraft = async (
  apiUrl: string,
  data: CreateEventInputs,
  items: ItemBasics[],
  uids: { clientUid: string; billingUid: string; deliveryUid: string }
): Promise<Client> => {
  const response = await fetch(`${apiUrl}/api/events/save-draft`, {
    method: "POST",
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
      notes: data.eventNotes,
      internalNotes: data.internalNotes,
      items,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Saving event as a draft failed.", errorData);
  }

  return await response.json();
};

export { fetchEvents, saveEventDraft };
