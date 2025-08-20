import Table from "../../components/Table/Table";
import { useEffect, useState } from "react";
import type { InventoryListItem } from "../../types/InventoryItem";
import InventoryCard from "./components/InventoryCard";
import {
  createInventoryItem,
  createInventoryPurchase,
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
import InventoryItemForm, {
  type InventoryItemInput,
} from "./components/InventoryItemForm";
import type { SubmitHandler } from "react-hook-form";
import { type InventoryType } from "../../types/InventoryConfigResponse";
import InventoryPurchaseForm, {
  type InventoryPurchaseInput,
} from "./components/InventoryPurchaseForm";

export type InventoryModalType = null | "addItem" | "addStock";

const Inventory: React.FC = () => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();
  const [items, setItems] = useState<InventoryListItem[]>([]);
  const [page, setPage] = useState<number>(1);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const [openModal, setOpenModal] = useState<InventoryModalType>(null);
  const [types, setTypes] = useState<InventoryType[]>([]);
  const [selectedItem, setSelectedItem] = useState<{
    uid: string;
    name: string;
  } | null>(null);

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

  const onSubmit: SubmitHandler<InventoryItemInput> = async (data) => {
    try {
      setErrors(null);
      const newItem = await createInventoryItem(apiUrl, data);

      const updatedItems = [...items, newItem].sort((a, b) => {
        return a.sku.localeCompare(b.sku);
      });

      setItems(updatedItems);
      setOpenModal(null);
      addToast("Success", `${newItem.sku} successfully added.`);
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  const onSubmitPurchase: SubmitHandler<InventoryPurchaseInput> = async (
    data
  ) => {
    try {
      setErrors(null);
      if (selectedItem?.uid) {
        const newPurchase = await createInventoryPurchase(
          apiUrl,
          data,
          selectedItem?.uid
        );

        const updatedItems = items.map((i) =>
          i.uid === newPurchase.uid
            ? { ...i, quantityTotal: newPurchase.quantityTotal }
            : i
        );
        setItems(updatedItems);
        setOpenModal(null);
        addToast(
          "Success",
          `${data.quantity} units of ${selectedItem.name} added to stock.`
        );
      }
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  useEffect(() => {
    handleInventoryFetch();
    handleInventoryConfigFetch();
  }, [page]);

  useEffect(() => {
    if (openModal === null) {
      setSelectedItem(null);
    }
  }, [openModal]);

  return (
    <div className="flex flex-col items-center bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      {openModal === "addItem" && (
        <AddModal<InventoryModalType>
          openModal={openModal}
          setOpenModal={setOpenModal}
          title="Add Item"
          setErrors={setErrors}
          modalKey="addItem"
        >
          <InventoryItemForm
            onSubmit={onSubmit}
            errors={errors}
            types={types}
          />
        </AddModal>
      )}
      {openModal === "addStock" && (
        <AddModal<InventoryModalType>
          openModal={openModal}
          setOpenModal={setOpenModal}
          title="Add Stock"
          setErrors={setErrors}
          modalKey="addStock"
        >
          <InventoryPurchaseForm
            onSubmit={onSubmitPurchase}
            errors={errors}
            item={selectedItem}
          />
        </AddModal>
      )}
      <div className="flex justify-between w-full">
        <SearchBar placeholder="Search" />
        <AddButton<InventoryModalType>
          Icon={Plus}
          label="Item"
          addModalOpen={setOpenModal}
          modalKey="addItem"
        />
      </div>
      <Table
        columnTemplate={columnTemplate}
        headers={headers}
        tableItems={items}
        tableCardType={InventoryCard}
        getKey={(item) => item.sku}
        gap={10}
        setOpenModal={setOpenModal}
        setSelectedItem={setSelectedItem}
      />
    </div>
  );
};

export default Inventory;
