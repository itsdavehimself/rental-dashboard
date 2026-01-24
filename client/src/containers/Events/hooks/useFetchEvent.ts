import { type ErrorsState } from "../../../helpers/handleError";
import { useEffect, useState, useCallback } from "react";
import { getEventDetails } from "../services/eventService";
import { handleError } from "../../../helpers/handleError";
import { useToast } from "../../../hooks/useToast";
import { type Event } from "../types/Event";
import splitDateTime from "../helpers/splitDateTime";

export function useFetchEvent(eventUid: string | null) {
  const [errors, setErrors] = useState<ErrorsState | null>(null);
  const [state, setState] = useState<{
    event: Event | null;
    eventStart: { date: Date; time: string } | null;
    eventEnd: { date: Date; time: string } | null;
    loading: boolean;
  }>({
    event: null,
    eventStart: null,
    eventEnd: null,
    loading: true,
  });

  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchEvent = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    if (!eventUid) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    try {
      const data = await getEventDetails(apiUrl, eventUid);
      setState({
        event: data,
        eventStart: splitDateTime(new Date(data.eventStart)),
        eventEnd: splitDateTime(new Date(data.eventEnd)),
        loading: false,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        addToast("Error", err.message);
      } else {
        addToast("Error", String(err));
      }
      handleError(err, setErrors);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [apiUrl, eventUid]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  return { ...state, fetchEvent };
}
