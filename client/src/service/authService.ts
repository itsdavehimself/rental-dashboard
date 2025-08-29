import type { CreateUser, User } from "../types/User";
import { CustomError } from "../types/CustomError";

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
      phoneNumber: data.phoneNumber.replaceAll("-", ""),
      startDate: data.startDate,
      jobTitleId: data.jobTitleId,
      roleId: data.roleId,
      payRate: data.payRate ? data.payRate / 100 : 0,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Registration failed.", errorData);
  }

  return await response.json();
};

export { registerUser };
