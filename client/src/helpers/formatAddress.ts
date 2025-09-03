import type { Address } from "../types/Address";

export const formatAddress = (billingAddress: Address) => {
  return `${billingAddress.street}${
    billingAddress.unit ? `, ${billingAddress.unit},` : ","
  } ${billingAddress.city}, ${billingAddress.state} ${billingAddress.zipCode}`;
};
