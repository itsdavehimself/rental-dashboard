type Address = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
};

type AddressEntry = {
  uid: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary?: boolean;
};

type CreateAddressEntry = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary?: boolean;
};

type AddressResult = {
  id: number;
  addressLine1: string;
  city: string;
  state: string;
  zipCode: string;
};

export type { Address, AddressEntry, AddressResult, CreateAddressEntry };
