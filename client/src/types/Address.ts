type Address = {
  street: string;
  unit?: string;
  city: string;
  state: string;
  zipCode: string;
  isPrimary?: boolean;
};

type AddressResult = {
  street: string;
  city: string;
  state: string;
  zipCode: string;
};

export type { Address, AddressResult };
