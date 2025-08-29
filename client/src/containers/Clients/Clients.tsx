import { useState } from "react";
import Table from "../../components/Table/Table";
import AddButton from "../../components/common/AddButton";
import { Plus } from "lucide-react";
import AddModal from "../../components/common/AddModal";
import SearchBar from "../../components/common/DebouncedSearchBar";
import ResidentialClientForm from "./components/ResidentialClientForm";
import ResidentialClientRow from "./components/ResidentialClientRow";
import { useResidentialClients } from "../../hooks/useResidentialClients";

export type ClientModalType = null | "addClient";

const Clients: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<ClientModalType>(null);

  const { residentialClients, setResidentialClients, errors, setErrors } =
    useResidentialClients(page);

  const headers = [
    "Last Name",
    "First Name",
    "Phone Number",
    "Billing Address",
  ];
  const columnTemplate = "[grid-template-columns:1fr_1fr_0.75fr_2fr]";
  return (
    <div className="flex flex-col items-center bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      {openModal === "addClient" && (
        <AddModal<ClientModalType>
          openModal={openModal}
          setOpenModal={setOpenModal}
          title="Add Client"
          setErrors={setErrors}
          modalKey="addClient"
        >
          <ResidentialClientForm
            errors={errors}
            setErrors={setErrors}
            residentialClients={residentialClients}
            setResidentialClients={setResidentialClients}
            setOpenModal={setOpenModal}
          />
        </AddModal>
      )}
      <h2 className="self-start text-2xl font-semibold">Clients</h2>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <SearchBar placeholder="Search" />
          <AddButton<ClientModalType>
            Icon={Plus}
            label="Client"
            addModalOpen={setOpenModal}
            modalKey="addClient"
          />
        </div>
        <Table
          columnTemplate={columnTemplate}
          headers={headers}
          tableItems={residentialClients}
          tableRowType={ResidentialClientRow}
          getKey={(client) => client.uid}
          gap={4}
        />
      </div>
    </div>
  );
};

export default Clients;
