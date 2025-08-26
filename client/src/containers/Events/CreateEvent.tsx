import Table from "../../components/Table/Table";
import { useState } from "react";
import type { ClientSearchResult } from "../../types/Client";
import ResidentialClientCard from "../Clients/components/ResidentialClientCard";

const CreateEvent: React.FC = () => {
  const [clients, setClients] = useState<ClientSearchResult[]>([]);
  const headers = [
    "Last Name",
    "First Name",
    "Phone Number",
    "Client Since",
    "",
  ];
  const columnTemplate = "[grid-template-columns:1fr_1fr_1fr_1fr_3rem]";

  return (
    <div className="flex flex-col items-center bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      <div className="flex flex-col gap-4 w-full xl:w-2/3">
        <Table
          columnTemplate={columnTemplate}
          headers={headers}
          tableItems={clients}
          tableCardType={ResidentialClientCard}
          getKey={(client) => client.uid}
          gap={4}
        />
      </div>
    </div>
  );
};

export default CreateEvent;
