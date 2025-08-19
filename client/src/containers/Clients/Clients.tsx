import { useState, useEffect } from "react";
import Table from "../../components/Table/Table";
import type { ResidentialClient } from "../../types/ResidentialClient";
import ResidentialClientCard from "./components/ResidentialClientCard";
import { useToast } from "../../hooks/useToast";
import { type ErrorsState, handleError } from "../../helpers/handleError";
import {
  createResidentialClient,
  fetchResidentialClients,
} from "../../service/clientService";
import AddButton from "../../components/common/AddButton";
import { Plus } from "lucide-react";
import AddModal from "../../components/common/AddModal";
import SearchBar from "../../components/common/SearchBar";
import ResidentialClientForm, {
  type ResidentialClientInputs,
} from "./components/ResidentialClientForm";
import type { SubmitHandler } from "react-hook-form";

export type ClientModalType = null | "addClient";

const Clients: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();

  const [clients, setClients] = useState<ResidentialClient[]>([]);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const [page, setPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<ClientModalType>(null);

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

  const onSubmit: SubmitHandler<ResidentialClientInputs> = async (data) => {
    try {
      setErrors(null);
      const newClient = await createResidentialClient(apiUrl, data);

      const updatedUsers = [...clients, newClient].sort((a, b) => {
        const last = a.lastName.localeCompare(b.lastName);
        return last !== 0 ? last : a.firstName.localeCompare(b.firstName);
      });

      setClients(updatedUsers);
      setOpenModal(null);
      addToast(
        "Success",
        `${newClient.firstName} ${newClient.lastName} successfully added as a client.`
      );
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  useEffect(() => {
    handleClientFetch();
  }, [page]);

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
          <ResidentialClientForm onSubmit={onSubmit} errors={errors} />
        </AddModal>
      )}
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
        tableItems={clients}
        tableCardType={ResidentialClientCard}
        getKey={(client) => client.uid}
        gap={4}
        setOpenModal={setOpenModal}
      />
    </div>
  );
};

export default Clients;
