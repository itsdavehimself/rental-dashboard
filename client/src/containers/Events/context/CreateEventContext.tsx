import React, { createContext } from "react";
import type { ClientDetail } from "../../Clients/types/Client";
import type { CreateEventModalType } from "../CreateEvent/CreateEvent";
import type { AddressEntry } from "../../../types/Address";
import type { EventStatus } from "../types/Event";

export interface CreateEventContextType {
  client: ClientDetail | null;
  setClient: React.Dispatch<React.SetStateAction<ClientDetail | null>>;
  openModal: CreateEventModalType;
  setOpenModal: React.Dispatch<React.SetStateAction<CreateEventModalType>>;
  eventBilling: AddressEntry | null;
  setEventBilling: React.Dispatch<React.SetStateAction<AddressEntry | null>>;
  eventDelivery: AddressEntry | null;
  setEventDelivery: React.Dispatch<React.SetStateAction<AddressEntry | null>>;
  eventUid: string | null;
  setEventUid: React.Dispatch<React.SetStateAction<string | null>>;
  clearContext: () => void;
  eventStatus: EventStatus | null;
  setEventStatus: React.Dispatch<React.SetStateAction<EventStatus | null>>;
  isLoading: boolean;
  eventName: string | null;
  internalNotes: string | null;
  eventNotes: string | null;
  eventType: string | null;
  eventStart: { date: Date; time: string } | null;
  eventEnd: { date: Date; time: string } | null;
}

export const CreateEventContext = createContext<
  CreateEventContextType | undefined
>(undefined);
