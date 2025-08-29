import { useEffect, useState } from "react";
import { handleError } from "../helpers/handleError";
import { useToast } from "./useToast";
import type { ErrorsState } from "../helpers/handleError";
import type { ResidentialClient } from "../types/Client";
import { fetchResidentialClients } from "../service/clientService";

export function useResidentialClients(page: number) {
  const [residentialClients, setResidentialClients] = useState<
    ResidentialClient[]
  >([]);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const refresh = async () => {
    try {
      const clientList = await fetchResidentialClients(apiUrl, page);
      setResidentialClients(clientList.data);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching inventory data.");
    }
  };

  useEffect(() => {
    refresh();
  }, [page]);

  return {
    residentialClients,
    setResidentialClients,
    errors,
    setErrors,
    refresh,
  };
}
