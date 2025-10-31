type InventoryListItem = {
  uid: string;
  description: string;
  quantityTotal: number;
  sku: string;
  unitPrice?: number;
};

type InventoryItemDetails = {
  uid: string;
  description: string;
  type: string;
  subType: string;
  color: string;
  quantityTotal: number;
  sku: string;
  notes?: string;
  imageUrl?: string;
  length?: number;
  width?: number;
  height?: number;
  material?: number;
  unitPrice?: number;
  purchaseCost?: number;
  isActive: boolean;
  packageOnly: boolean;
};

type InventoryItemSearchResult = {
  uid: string;
  description: string;
  quantityTotal: number;
  sku: string;
  unitPrice: number;
  type: string;
  subType: string;
  material?: string;
  color?: string;
  bounceHouseType?: string;
};

export type {
  InventoryItemDetails,
  InventoryListItem,
  InventoryItemSearchResult,
};
