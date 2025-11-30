import { type ErrorsState } from "../../../helpers/handleError";
import { useEffect, useState, useCallback } from "react";
import { getEventDetails } from "../services/eventService";
import { handleError } from "../../../helpers/handleError";
import { useToast } from "../../../hooks/useToast";
import { type Event } from "../types/Event";
import splitDateTime from "../helpers/splitDateTime";

export function useFetchEvent(eventUid: string | null) {
  const [event, setEvent] = useState<Event | null>(null);
  const [errors, setErrors] = useState<ErrorsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [eventStart, setEventStart] = useState<{
    date: Date;
    time: string;
  } | null>(null);
  const [eventEnd, setEventEnd] = useState<{
    date: Date;
    time: string;
  } | null>(null);

  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchEvent = useCallback(async () => {
    if (!eventUid) {
      setLoading(false);
      return;
    }

    try {
      const data = await getEventDetails(apiUrl, eventUid);
      setEvent(data);
      setEventStart(splitDateTime(new Date(data.eventStart)));
      setEventEnd(splitDateTime(new Date(data.eventEnd)));
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching event data.");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, eventUid]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return {
    event,
    setEvent,
    errors,
    setErrors,
    loading,
    fetchEvent,
    eventStart,
    eventEnd,
  };
}
