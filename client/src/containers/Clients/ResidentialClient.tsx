import { useParams } from "react-router";
import { getClientDetails } from "../../service/clientService";
import { useToast } from "../../hooks/useToast";
import { useState, useEffect } from "react";
import type { ResidentialClient } from "../../types/Client";
import type { ErrorsState } from "../../helpers/handleError";
import { handleError } from "../../helpers/handleError";

const ResidentialClientDetails: React.FC = () => {
  const { uid } = useParams<{ uid: string }>();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();

  const [client, setClient] = useState<ResidentialClient | null>(null);
  const [errors, setErrors] = useState<ErrorsState>(null);

  const handleClientFetch = async (): Promise<void> => {
    try {
      if (uid) {
        const clientData = await getClientDetails(apiUrl, uid);
        setClient(clientData);
      }
    } catch (err) {
      handleError(err, setErrors);
      addToast(
        "Error",
        "There was a problem fetching this client's details. Please try again."
      );
    }
  };

  useEffect(() => {
    handleClientFetch();
  }, [uid]);

  return (
    <div className="flex flex-col bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      {client?.firstName}
    </div>
  );
};

export default ResidentialClientDetails;
