import type { Address } from "../types/Address";

export const formatAddress = (billingAddress: Address) => {
  return `${billingAddress.addressLine1}${
    billingAddress.addressLine2 ? `, ${billingAddress.addressLine2},` : ","
  } ${billingAddress.city}, ${billingAddress.state} ${billingAddress.zipCode}`;
};
