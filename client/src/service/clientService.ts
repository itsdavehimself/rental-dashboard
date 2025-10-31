import { CustomError } from "../types/CustomError";
import type { PaginatedResponse } from "../types/PaginatedResponse";
import type {
  ClientDetail,
  ClientSearchResult,
  CreateClient,
  Client,
} from "../types/Client";
import type { AddressEntry, CreateAddressEntry } from "../types/Address";

const fetchClients = async (
  apiUrl: string,
  page: number
): Promise<PaginatedResponse<Client>> => {
  const response = await fetch(
    `${apiUrl}/api/client?page=${page}&pageSize=25`,
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

const updateClient = async (
  apiUrl: string,
  uid: string,
  note: string
): Promise<Client> => {
  const response = await fetch(`${apiUrl}/api/client/${uid}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      notes: note,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Updating client failed.", errorData);
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

const createClient = async (
  apiUrl: string,
  data: CreateClient
): Promise<Client> => {
  const response = await fetch(`${apiUrl}/api/client`, {
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
        addressLine1: data.address.addressLine1,
        addressLine2: data.address.addressLine2,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
      },
      type: data.type,
      ...(data.type === "Business" && {
        businessName: data.businessName,
        isTaxExempt: data.isTaxExempt,
      }),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Creating client failed.", errorData);
  }

  return await response.json();
};

const createAddressEntry = async (
  clientUid: string,
  apiUrl: string,
  data: CreateAddressEntry,
  type: "billing" | "delivery"
): Promise<AddressEntry> => {
  const response = await fetch(
    `${apiUrl}/api/client/${clientUid}/client-addresses`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber.replaceAll("-", ""),
        email: data.email,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        isPrimary: data.isPrimary,
        type,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Creating address failed.", errorData);
  }

  return await response.json();
};

const updateAddressEntry = async (
  addressUid: string,
  apiUrl: string,
  data: CreateAddressEntry,
  type: "billing" | "delivery"
): Promise<AddressEntry> => {
  const response = await fetch(
    `${apiUrl}/api/client/client-addresses/${addressUid}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber.replaceAll("-", ""),
        email: data.email,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        isPrimary: data.isPrimary,
        type,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Upading address failed.", errorData);
  }

  return await response.json();
};

const setAddressEntryAsPrimary = async (
  apiUrl: string,
  addressUid: string,
  type: string
): Promise<void> => {
  const response = await fetch(
    `${apiUrl}/api/client/client-addresses/${addressUid}/${type}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Setting address as primary failed.", errorData);
  }

  return;
};

const deleteAddressEntry = async (
  apiUrl: string,
  addressUid: string
): Promise<void> => {
  const response = await fetch(
    `${apiUrl}/api/client/client-addresses/${addressUid}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Deleting address failed.", errorData);
  }

  return;
};

export {
  fetchClients,
  createClient,
  getClientDetails,
  searchClients,
  updateClient,
  createAddressEntry,
  updateAddressEntry,
  setAddressEntryAsPrimary,
  deleteAddressEntry,
};
