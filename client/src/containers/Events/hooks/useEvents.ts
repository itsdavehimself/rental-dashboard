import { useEffect, useState } from "react";
import { handleError } from "../../../helpers/handleError";
import { useToast } from "../../../hooks/useToast";
import type { ErrorsState } from "../../../helpers/handleError";
import type { Event } from "../types/Event";
import { fetchEvents } from "../services/eventService";

export function useEvents(page: number) {
  const [events, setEvents] = useState<Event[]>([]);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const refresh = async () => {
    try {
      const eventList = await fetchEvents(apiUrl, page);
      setEvents(eventList.data);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching events.");
    }
  };

  useEffect(() => {
    refresh();
  }, [page]);

  return {
    events,
    setEvents,
    errors,
    setErrors,
    refresh,
  };
}
