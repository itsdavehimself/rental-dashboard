import type { PaginatedResponse } from "../types/PaginatedResponse";
import type { ListInventoryItem } from "../types/InventoryItem";
import { CustomError } from "../types/CustomError";
import type { InventoryConfigResponse } from "../types/InventoryConfigResponse";

const fetchInventoryItems = async (
  apiUrl: string,
  page: number
): Promise<PaginatedResponse<ListInventoryItem>> => {
  const response = await fetch(
    `${apiUrl}/api/inventory?page=${page}&pageSize=25&isActive=true`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Fetching inventory failed.", errorData);
  }

  return await response.json();
};

const fetchInventoryConfig = async (
  apiUrl: string
): Promise<InventoryConfigResponse> => {
  const response = await fetch(`${apiUrl}/api/inventory/config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Fetching inventory config failed.", errorData);
  }

  return await response.json();
};

export { fetchInventoryItems, fetchInventoryConfig };
