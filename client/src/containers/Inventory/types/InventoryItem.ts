type InventoryListItem = {
  uid: string;
  description: string;
  quantityTotal: number;
  sku: string;
  unitPrice: number;
  imageUrl?: string | null;
};

export type InventoryPurchase = {
  id: number;
  quantityPurchased: number;
  unitCost: number;
  vendorName?: string;
  datePurchased: string;
};

export type InventoryRetirement = {
  id: number;
  quantityRetired: number;
  reason: number;
  notes?: string;
  dateRetired: string;
};

export type InventoryItemComponent = {
  id: number;
  childItemUid: string;
  description: string;
  sku: string;
  quantity: number;
  isRequired: boolean;
};

type InventoryItemDetails = {
  uid: string;
  description: string;
  type: string;
  subType: string;
  color: string;
  material: string;
  bounceHouseType: string;
  quantityTotal: number;
  sku: string;
  notes?: string;
  imageUrl?: string;
  length?: number;
  width?: number;
  height?: number;
  unitPrice: number;
  averagePurchaseCost?: number;
  isActive: boolean;
  packageOnly: boolean;
  purchases: InventoryPurchase[];
  retirements: InventoryRetirement[];
  components: InventoryItemComponent[];
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
  imageUrl?: string | null;
};

type InventoryAvailability = {
  uid: string;
  reservedQuantity: number;
  availableQuantity: number;
};

export type {
  InventoryItemDetails,
  InventoryListItem,
  InventoryItemSearchResult,
  InventoryAvailability,
};
