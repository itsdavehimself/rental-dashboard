import type { Address } from "./Address";
import type { Contact } from "./Contact";

type ResidentialClient = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
  createdAt: string;
  billingAddress: Address;
  deliveryAddress: Address;
};

type CreateResidentialClient = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
  address: Omit<Address, "isPrimary">;
};

type ClientSearchResult = {
  uid: string;
  type: "Residential" | "Business";
  firstName?: string;
  lastName?: string;
  businessName?: string;
  email?: string;
  phoneNumber?: string;
  notes?: string;
  createdAt: string;
  billingAddress: Address;
};

type ClientDetail = {
  uid: string;
  type: "Residential" | "Business";
  createdAt: string;
  notes?: string;
  // Residential-specific
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  // Business-specific
  businessName?: string;
  isTaxExempt?: boolean;
  contacts?: Contact[];
  // Both
  billingAddresses: Address[];
  deliveryAddresses: Address[];
};

export const CLIENT_TYPES = {
  Residential: "Residential",
  Business: "Business",
} as const;

export type ClientType = keyof typeof CLIENT_TYPES;

export type {
  ResidentialClient,
  CreateResidentialClient,
  ClientSearchResult,
  ClientDetail,
};
