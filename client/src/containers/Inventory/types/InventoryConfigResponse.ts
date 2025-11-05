export type BounceHouseType = {
  id: number;
  name: string;
  label: string;
};

export type InventoryMaterial = {
  id: number;
  name: string;
  label: string;
  skuCode: string;
};

export type InventoryColor = {
  id: number;
  name: string;
  label: string;
  skuCode: string;
};

export type InventorySubType = {
  id: number;
  name: string;
  label: string;
  skuCode: string;
  materials: InventoryMaterial[];
  colors: InventoryColor[];
  bounceHouseTypes: BounceHouseType[];
};

export type InventoryType = {
  id: number;
  name: string;
  label: string;
  skuCode: string;
  subTypes: InventorySubType[];
};

export type InventoryConfigResponse = {
  types: InventoryType[];
};
