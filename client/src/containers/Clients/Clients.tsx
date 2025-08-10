import { useState, useEffect } from "react";
import Table from "../../components/Table/Table";
import type { ResidentialClient } from "../../types/ResidentialClient";
import ResidentialClientCard from "./components/ResidentialClientCard";
import { useToast } from "../../hooks/useToast";
import { type ErrorsState, handleError } from "../../helpers/handleError";
import { fetchResidentialClients } from "../../service/clientService";
import AddButton from "../../components/common/AddButton";
import { Plus } from "lucide-react";
import AddModal from "../../components/common/AddModal";
import SearchBar from "../../components/common/SearchBar";

const Clients: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();

  const [clients, setClients] = useState<ResidentialClient[]>([]);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const [page, setPage] = useState<number>(1);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const handleClientFetch = async (): Promise<void> => {
    try {
      const clientsList = await fetchResidentialClients(apiUrl, page);
      setClients(clientsList.data);
    } catch (err) {
      handleError(err, setErrors);
      addToast(
        "Error",
        "There was a problem fetching clients. Please try again."
      );
    }
  };

  const headers = [
    "Last Name",
    "First Name",
    "Phone Number",
    "Client Since",
    "",
  ];
  const columnTemplate = "[grid-template-columns:1fr_1fr_1fr_1fr_3rem]";

  useEffect(() => {
    handleClientFetch();
  }, [page]);

  return (
    <div className="flex flex-col items-center bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      {addModalOpen && (
        <AddModal
          openModal={addModalOpen}
          setOpenModal={setAddModalOpen}
          title="Add Client"
          setIsModalOpen={setAddModalOpen}
          setErrors={setErrors}
        ></AddModal>
      )}
      <div className="flex justify-between w-full">
        <SearchBar placeholder="Search" />
        <AddButton Icon={Plus} label="Client" addModalOpen={setAddModalOpen} />
      </div>
      <Table
        columnTemplate={columnTemplate}
        headers={headers}
        tableItems={clients}
        tableCardType={ResidentialClientCard}
        getKey={(client) => client.uid}
      />
    </div>
  );
};

export default Clients;
