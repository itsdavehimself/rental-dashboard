import { useState, useEffect } from "react";
import { fetchUsers } from "../../service/userService";
import type { User } from "../../types/User";
import MemberCard from "./components/MemberCard";
import Table from "../../components/Table/Table";
import SearchBar from "../../components/common/SearchBar";
import AddButton from "../../components/common/AddButton";
import { Plus } from "lucide-react";
import AddModal from "../../components/common/AddModal";
import type { SubmitHandler } from "react-hook-form";
import TeamMemberForm from "./components/TeamMemberForm";

export type TeamMemberInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

const Team: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [filter, setFilter] = useState<"active" | "inactive" | "all">("active");
  const [users, setUsers] = useState<User[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const handleUserFetch = async (url: string): Promise<void> => {
    const userList: User[] = await fetchUsers(apiUrl, url);
    setUsers(userList);
  };

  const headers = ["Name", "Role", "Phone Number", "Started", ""];
  const columnTemplate = "[grid-template-columns:1fr_1fr_1fr_1fr_3rem]";

  const onSubmit: SubmitHandler<TeamMemberInputs> = async (data) => {
    console.log(data);
  };

  useEffect(() => {
    let url = "api/users";
    if (filter === "active") url += "?isActive=true";
    else if (filter === "inactive") url += "?isActive=false";
    handleUserFetch(url);
  }, [filter]);

  return (
    <div className="flex flex-col items-center bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      {addModalOpen && (
        <AddModal title="Add Team Member" setIsModalOpen={setAddModalOpen}>
          <TeamMemberForm onSubmit={onSubmit} />
        </AddModal>
      )}
      <div className="flex justify-between w-full">
        <SearchBar placeholder="Search" />
        <AddButton
          Icon={Plus}
          label="Team Member"
          addModalOpen={setAddModalOpen}
        />
      </div>
      <Table
        columnTemplate={columnTemplate}
        headers={headers}
        tableItems={users}
        tableCardType={MemberCard}
        getKey={(user) => user.uid}
      />
    </div>
  );
};

export default Team;
