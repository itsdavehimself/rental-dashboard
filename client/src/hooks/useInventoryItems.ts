import { useEffect, useState } from "react";
import { fetchInventoryItems } from "../service/inventoryService";
import { handleError } from "../helpers/handleError";
import { useToast } from "./useToast";
import type { InventoryListItem } from "../types/InventoryItem";
import type { ErrorsState } from "../helpers/handleError";

export function useInventoryItems(page: number) {
  const [items, setItems] = useState<InventoryListItem[]>([]);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const refresh = async () => {
    try {
      const itemList = await fetchInventoryItems(apiUrl, page);
      setItems(itemList.data);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching inventory data.");
    }
  };

  useEffect(() => {
    refresh();
  }, [page]);

  return {
    items,
    setItems,
    errors,
    setErrors,
    refresh,
  };
}
