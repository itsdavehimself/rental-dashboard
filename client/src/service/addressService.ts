import { type PaginatedResponse } from "../types/PaginatedResponse";
import { type AddressResult } from "../types/Address";
import { CustomError } from "../types/CustomError";

const searchAddress = async (
  apiUrl: string,
  query: string
): Promise<PaginatedResponse<AddressResult>> => {
  const response = await fetch(
    `${apiUrl}/api/address?page=1&pageSize=10&query=${query}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Getting addresses failed.", errorData);
  }

  return await response.json();
};

export { searchAddress };
