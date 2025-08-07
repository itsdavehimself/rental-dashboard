import type { Role } from "../types/Role";

const fetchRoles = async (apiUrl: string): Promise<Role[]> => {
  const response = await fetch(`${apiUrl}/api/role`, {
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
        "Couldn't get roles. Please try again or contact IT if the issue persists.";
    throw new Error(message);
  }
  return await response.json();
};

export { fetchRoles };
