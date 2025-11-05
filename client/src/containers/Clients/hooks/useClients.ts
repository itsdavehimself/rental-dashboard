import { useEffect, useState } from "react";
import { handleError } from "../../../helpers/handleError";
import { useToast } from "../../../hooks/useToast";
import type { ErrorsState } from "../../../helpers/handleError";
import type { Client } from "../types/Client";
import { fetchClients } from "../services/clientService";

export function useClients(page: number) {
  const [clients, setClients] = useState<Client[]>([]);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const refresh = async () => {
    try {
      const clientList = await fetchClients(apiUrl, page);
      setClients(clientList.data);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching clients.");
    }
  };

  useEffect(() => {
    refresh();
  }, [page]);

  return {
    clients,
    setClients,
    errors,
    setErrors,
    refresh,
  };
}
