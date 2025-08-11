import { CustomError } from "../types/CustomError";
import type { PaginatedResponse } from "../types/PaginatedResponse";
import type {
  CreateResidentialClient,
  ResidentialClient,
} from "../types/ResidentialClient";

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

const getResidentialClient = async (
  apiUrl: string,
  uid: string
): Promise<ResidentialClient> => {
  const response = await fetch(`${apiUrl}/api/residentialclient/${uid}`, {
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
  const response = await fetch(`${apiUrl}/api/residentialclient/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
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
  getResidentialClient,
};
