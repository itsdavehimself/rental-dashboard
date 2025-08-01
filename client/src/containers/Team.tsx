import { useState, useEffect } from "react";
import { fetchUsers } from "../service/userService";
import type { User } from "../types/User";

const Team: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [filter, setFilter] = useState<"active" | "inactive" | "all">("active");
  const [users, setUsers] = useState<User[]>([]);

  const handleUserFetch = async (url: string): Promise<void> => {
    const userList: User[] = await fetchUsers(apiUrl, url);
    console.log(userList);
    setUsers(userList);
  };

  useEffect(() => {
    let url = "api/users";
    if (filter === "active") url += "?isActive=true";
    else if (filter === "inactive") url += "?isActive=false";
    handleUserFetch(url);
  }, [filter]);

  return (
    <div className="bg-white h-screen w-full shadow-md rounded-3xl">
      {users.map((u) => u.firstName)}
    </div>
  );
};

export default Team;
