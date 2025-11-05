import type { JobTitle } from "../types/JobTitle";

const fetchJobTitles = async (apiUrl: string): Promise<JobTitle[]> => {
  const response = await fetch(`${apiUrl}/api/jobtitle`, {
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
        "Error getting job titles. Please try again or contact IT if the issue persists.";
    throw new Error(message);
  }
  return await response.json();
};

export { fetchJobTitles };
