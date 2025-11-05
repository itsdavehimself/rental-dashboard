import { useState } from "react";
import type { User } from "./types/User";
import MemberRow from "./components/MemberRow";
import Table from "../../components/Table/Table";
import SearchBar from "../../components/common/DebouncedSearchBar";
import AddButton from "../../components/common/AddButton";
import { Plus } from "lucide-react";
import AddModal from "../../components/common/AddModal";
import TeamMemberForm from "./components/TeamMemberForm";
import { useUsers } from "./hooks/useUsers";

export type TeamModalType = null | "addTeamMember";

const Team: React.FC = () => {
  const [filter, setFilter] = useState<"active" | "inactive" | "all">("active");
  const [openModal, setOpenModal] = useState<TeamModalType>(null);
  const { users, setUsers, errors, setErrors } = useUsers(filter);

  const headers = ["Name", "Position", "Phone Number", "Started"];
  const columnTemplate = "[grid-template-columns:1fr_1fr_1fr_1fr]";

  return (
    <div className="flex flex-col items-center bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      {openModal === "addTeamMember" && (
        <AddModal<TeamModalType>
          openModal={openModal}
          setOpenModal={setOpenModal}
          title="Add Team Member"
          setErrors={setErrors}
          modalKey="addTeamMember"
        >
          <TeamMemberForm
            errors={errors}
            setErrors={setErrors}
            setUsers={setUsers}
            users={users}
            setOpenModal={setOpenModal}
          />
        </AddModal>
      )}
      <h2 className="self-start text-2xl font-semibold">Team</h2>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <SearchBar placeholder="Search" />
          <AddButton<TeamModalType>
            Icon={Plus}
            label="Team Member"
            addModalOpen={setOpenModal}
            modalKey="addTeamMember"
          />
        </div>
        <Table<User>
          columnTemplate={columnTemplate}
          headers={headers}
          tableItems={users}
          tableRowType={MemberRow}
          getKey={(user) => user.uid}
          gap={4}
        />
      </div>
    </div>
  );
};

export default Team;
