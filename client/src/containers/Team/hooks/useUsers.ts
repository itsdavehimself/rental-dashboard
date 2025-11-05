import { useState, useEffect } from "react";
import { type User } from "../types/User";
import { handleError, type ErrorsState } from "../../../helpers/handleError";
import { useToast } from "../../../hooks/useToast";
import { fetchUsers } from "../services/userService";

export function useUsers(filter: "active" | "inactive" | "all") {
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const { addToast } = useToast();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const refresh = async () => {
    try {
      let url = "api/users";
      if (filter === "active") url += "?isActive=true";
      else if (filter === "inactive") url += "?isActive=false";

      const userList = await fetchUsers(apiUrl, url);
      setUsers(userList);
    } catch (err) {
      handleError(err, setErrors);
      addToast(
        "Error",
        "There was a problem fetching team members. Please try again."
      );
    }
  };

  useEffect(() => {
    refresh();
  }, [filter]);

  return {
    users,
    errors,
    setUsers,
    setErrors,
    refresh,
  };
}
