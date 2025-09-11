import { CustomError } from "../types/CustomError";
import type { PaginatedResponse } from "../types/PaginatedResponse";
import type {
  ClientDetail,
  ClientSearchResult,
  CreateResidentialClient,
  ResidentialClient,
} from "../types/Client";

const fetchResidentialClients = async (
  apiUrl: string,
  page: number
): Promise<PaginatedResponse<ResidentialClient>> => {
  const response = await fetch(
    `${apiUrl}/api/client/residential?page=${page}&pageSize=25`,
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
    throw new CustomError("Getting clients failed.", errorData);
  }

  return await response.json();
};

const searchClients = async (
  apiUrl: string,
  page: number,
  query: string
): Promise<PaginatedResponse<ClientSearchResult>> => {
  const response = await fetch(
    `${apiUrl}/api/client/fuzzy-search?page=${page}&pageSize=25&query=${query}`,
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
    throw new CustomError("Getting clients failed.", errorData);
  }

  return await response.json();
};

const getClientDetails = async (
  apiUrl: string,
  uid: string
): Promise<ClientDetail> => {
  const response = await fetch(`${apiUrl}/api/client/${uid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Getting client failed.", errorData);
  }

  return await response.json();
};

const createResidentialClient = async (
  apiUrl: string,
  data: CreateResidentialClient
): Promise<ResidentialClient> => {
  const response = await fetch(`${apiUrl}/api/client/create-residential`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber.replaceAll("-", ""),
      notes: data.notes,
      address: {
        street: data.address.street,
        unit: data.address.unit,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Creating client failed.", errorData);
  }

  return await response.json();
};

export {
  fetchResidentialClients,
  createResidentialClient,
  getClientDetails,
  searchClients,
};
