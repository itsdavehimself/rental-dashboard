import { CustomError } from "../types/CustomError";
import type { PaginatedResponse } from "../types/PaginatedResponse";
import type { ResidentialClient } from "../types/ResidentialClient";

const fetchResidentialClients = async (
  apiUrl: string,
  page: number
): Promise<PaginatedResponse<ResidentialClient>> => {
  const response = await fetch(
    `${apiUrl}/api/residentialclient?page=${page}&pageSize=25`,
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
    throw new CustomError("Registration failed.", errorData);
  }

  return await response.json();
};

export { fetchResidentialClients };
