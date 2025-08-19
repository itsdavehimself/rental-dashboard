import type { PaginatedResponse } from "../types/PaginatedResponse";
import type { InventoryListItem } from "../types/InventoryItem";
import { CustomError } from "../types/CustomError";
import type { InventoryConfigResponse } from "../types/InventoryConfigResponse";
import type { InventoryItemInput } from "../containers/Inventory/components/InventoryItemForm";
import type { InventoryPurchaseInput } from "../containers/Inventory/components/InventoryPurchaseForm";

const fetchInventoryItems = async (
  apiUrl: string,
  page: number
): Promise<PaginatedResponse<InventoryListItem>> => {
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

const createInventoryItem = async (
  apiUrl: string,
  data: InventoryItemInput
): Promise<InventoryListItem> => {
  const response = await fetch(`${apiUrl}/api/inventory/item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      description: data.description,
      type: data.type,
      subType: data.subType,
      color: data.color,
      notes: data.notes,
      length: data.length,
      width: data.width,
      height: data.height,
      unitPrice: data.unitPrice / 100,
      material: data.material,
      variant: data.variant,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Creating sku failed.", errorData);
  }

  return await response.json();
};

const createInventoryPurchase = async (
  apiUrl: string,
  data: InventoryPurchaseInput,
  uid: string
): Promise<{ uid: string; quantityTotal: number }> => {
  const response = await fetch(`${apiUrl}/api/inventory/stock/${uid}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      quantityPurchased: data.quantity,
      unitCost: data.unitCost / 100,
      vendorName: data.vendorName,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Creating purchase failed.", errorData);
  }

  return await response.json();
};

export {
  fetchInventoryItems,
  fetchInventoryConfig,
  createInventoryItem,
  createInventoryPurchase,
};
