export type ListInventoryItem = {
  uid: string;
  description: string;
  quantityTotal: string;
  sku: string;
  unitPrice?: number;
};

export type InventoryItemDetails = {
  uid: string;
  description: string;
  type: string;
  subType: string;
  color: string;
  quantityTotal: string;
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
