import { createContext } from "react";

export interface BillingContextType {}

export const BillingContext = createContext<BillingContextType | undefined>(
  undefined,
);
