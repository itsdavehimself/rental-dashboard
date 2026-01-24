import { CustomError } from "../../../types/CustomError";
import type { CrewPreset } from "../types/CrewPreset";

const getCrewPresets = async (apiUrl: string): Promise<CrewPreset[]> => {
  const response = await fetch(`${apiUrl}/api/crew`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Getting crew presets failed.", errorData);
  }

  return await response.json();
};

export { getCrewPresets };
