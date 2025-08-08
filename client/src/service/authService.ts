import type { CreateUser, User } from "../types/User";

const registerUser = async (
  apiUrl: string,
  data: CreateUser
): Promise<User> => {
  const response = await fetch(`${apiUrl}/api/auth/register`, {
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
      startDate: data.startDate,
      jobTitleId: data.jobTitleId,
      roleId: data.roleId,
      payRate: data.payRate ? data.payRate / 100 : 0,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const message = Array.isArray(errorData)
      ? errorData.join(", ")
      : errorData?.message ||
        "Error registering user. Please try again or contact IT if the issue persists.";
    throw new Error(message);
  }

  return await response.json();
};

export { registerUser };
