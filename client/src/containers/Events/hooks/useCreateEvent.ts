import { useContext } from "react";
import { CreateEventContext } from "../context/CreateEventContext";

export const useCreateEvent = () => {
  const context = useContext(CreateEventContext);
  if (!context)
    throw new Error("useCreateEvent must be used within a CreateEventProvider");
  return context;
};
