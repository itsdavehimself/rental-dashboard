import Table from "../../components/Table/Table";
import { useEffect, useState } from "react";
import type { ListInventoryItem } from "../../types/InventoryItem";
import InventoryCard from "./components/InventoryCard";
import {
  fetchInventoryConfig,
  fetchInventoryItems,
} from "../../service/inventoryService";
import { useToast } from "../../hooks/useToast";
import { handleError } from "../../helpers/handleError";
import type { ErrorsState } from "../../helpers/handleError";
import AddButton from "../../components/common/AddButton";
import SearchBar from "../../components/common/SearchBar";
import { Plus } from "lucide-react";
import AddModal from "../../components/common/AddModal";
import InventorySkuForm, {
  type InventorySkuInput,
} from "./components/InventorySkuForm";
import type { SubmitHandler } from "react-hook-form";
import { type InventoryType } from "../../types/InventoryConfigResponse";

const Inventory: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();
  const [items, setItems] = useState<ListInventoryItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [types, setTypes] = useState<InventoryType[]>([]);

  const headers = ["SKU", "Item", "Total Qty", "Unit Price", ""];
  const columnTemplate = "[grid-template-columns:1fr_1fr_3.8rem_4rem_3rem]";

  const handleInventoryFetch = async (): Promise<void> => {
    try {
      const itemList = await fetchInventoryItems(apiUrl, page);
      setItems(itemList.data);
    } catch (err) {
      handleError(err, setErrors);
      addToast(
        "Error",
        "There was a problem fetching inventory data. Please try again."
      );
    }
  };

  const handleInventoryConfigFetch = async (): Promise<void> => {
    try {
      const configData = await fetchInventoryConfig(apiUrl);
      setTypes(configData.types);
    } catch (err) {
      handleError(err, setErrors);
      addToast(
        "Error",
        "There was a problem fetching the inventory config. Please try again."
      );
    }
  };

  const onSubmit: SubmitHandler<InventorySkuInput> = async (data) => {
    console.log(data);
    // try {
    //   setErrors(null);
    //   const newClient = await createResidentialClient(apiUrl, data);

    //   const updatedUsers = [...clients, newClient].sort((a, b) => {
    //     const last = a.lastName.localeCompare(b.lastName);
    //     return last !== 0 ? last : a.firstName.localeCompare(b.firstName);
    //   });

    //   setClients(updatedUsers);
    //   setAddModalOpen(false);
    //   addToast(
    //     "Success",
    //     `${newClient.firstName} ${newClient.lastName} successfully added as a client.`
    //   );
    // } catch (err) {
    //   handleError(err, setErrors);
    // }
  };

  useEffect(() => {
    handleInventoryFetch();
    handleInventoryConfigFetch();
  }, [page]);

  return (
    <div className="flex flex-col items-center bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      {addModalOpen && (
        <AddModal
          openModal={addModalOpen}
          setOpenModal={setAddModalOpen}
          title="Add SKU"
          setErrors={setErrors}
        >
          <InventorySkuForm onSubmit={onSubmit} errors={errors} types={types} />
        </AddModal>
      )}
      <div className="flex justify-between w-full">
        <SearchBar placeholder="Search" />
        <AddButton Icon={Plus} label="SKU" addModalOpen={setAddModalOpen} />
      </div>
      <Table
        columnTemplate={columnTemplate}
        headers={headers}
        tableItems={items}
        tableCardType={InventoryCard}
        getKey={(item) => item.sku}
        gap={10}
      />
    </div>
  );
};

export default Inventory;
