import { useEffect, useState } from "react";
import { fetchInventoryConfig } from "../service/inventoryService";
import { handleError } from "../helpers/handleError";
import { useToast } from "./useToast";
import type { InventoryType } from "../types/InventoryConfigResponse";
import type { ErrorsState } from "../helpers/handleError";

export function useInventoryConfig() {
  const [types, setTypes] = useState<InventoryType[]>([]);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const refresh = async () => {
    try {
      const config = await fetchInventoryConfig(apiUrl);
      setTypes(config.types);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "Problem fetching inventory config.");
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    types,
    refresh,
    errors,
  };
}
