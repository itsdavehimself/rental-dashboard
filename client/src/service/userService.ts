import type { User } from "../types/User";
import { CustomError } from "../types/CustomError";

const fetchUsers = async (apiUrl: string, url: string): Promise<User[]> => {
  const response = await fetch(`${apiUrl}/${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Registration failed.", errorData);
  }

  return await response.json();
};

export { fetchUsers };
