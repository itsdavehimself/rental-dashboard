import { type ErrorsState } from "../../../helpers/handleError";
import { type ClientDetail } from "../../Clients/types/Client";
import { useEffect, useState, useCallback } from "react";
import { getClientDetails } from "../../Clients/services/clientService";
import { handleError } from "../../../helpers/handleError";
import { useToast } from "../../../hooks/useToast";
import { useNavigate } from "react-router";

export function useFetchClient(clientUid: string | null) {
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [errors, setErrors] = useState<ErrorsState | null>(null);
  const [loading, setLoading] = useState(true);

  const { addToast } = useToast();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchClient = useCallback(async () => {
    if (!clientUid) {
      setLoading(false);
      return;
    }

    try {
      const data = await getClientDetails(apiUrl, clientUid);
      setClient(data);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching client data.");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, clientUid]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return {
    client,
    setClient,
    errors,
    setErrors,
    loading,
    fetchClient,
  };
}
