import type { Address, AddressEntry } from "../../../types/Address";

type Client = {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
  createdAt: string;
  billingAddress: Address;
  deliveryAddress: Address;
  businessName?: string;
  isTaxExempt: boolean;
  isLegacy: boolean;
};

type CreateClient = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
  address: Omit<Address, "isPrimary">;
  isTaxExempt: boolean;
  isLegacy: boolean;
  businessName?: string;
  type: "Residential" | "Business";
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
  // Both
  billingAddresses: AddressEntry[];
  deliveryAddresses: AddressEntry[];
  isLegacy: boolean;
};

export const CLIENT_TYPES = {
  Residential: "Residential",
  Business: "Business",
} as const;

export type ClientType = keyof typeof CLIENT_TYPES;

export type { Client, CreateClient, ClientDetail };
