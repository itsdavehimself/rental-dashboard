import { CustomError } from "../types/CustomError";
import type { TaxObject } from "../types/Tax";

const getTaxRate = async (
  apiUrl: string,
  zipCode: string
): Promise<TaxObject> => {
  const response = await fetch(`${apiUrl}/api/tax/${zipCode}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Failed getting tax rate.", errorData);
  }

  return await response.json();
};

export { getTaxRate };
