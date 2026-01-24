import { useContext } from "react";
import { EventDetailsContext } from "../context/EventDetailsContext";

export const useEventDetails = () => {
  const context = useContext(EventDetailsContext);
  if (!context)
    throw new Error(
      "useEventDetails must be used within a EventDetailsProvider"
    );
  return context;
};
