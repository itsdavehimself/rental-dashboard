import type { User } from "../types/User";

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
    const message = Array.isArray(errorData)
      ? errorData.join(", ")
      : errorData?.message ||
        "Couldn't get users. Please try again or contact IT if the issue persists.";
    throw new Error(message);
  }

  return await response.json();
};

export { fetchUsers };
