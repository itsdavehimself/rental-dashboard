import { useState, useEffect, useRef, useMemo } from "react";
import { BillingContext } from "./BillingContext";

export const BillingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const value = {};
  return (
    <BillingContext.Provider value={value}>{children}</BillingContext.Provider>
  );
};
