import Table from "../../components/Table/Table";
import { useEffect, useState } from "react";
import InventoryRow from "./components/InventoryRow";
import AddButton from "../../components/common/AddButton";
import SearchBar from "../../components/common/DebouncedSearchBar";
import { Plus } from "lucide-react";
import AddModal from "../../components/common/AddModal";
import InventoryItemForm from "./components/InventoryItemForm";
import { useInventoryItems } from "./hooks/useInventoryItems";
import { useInventoryConfig } from "./hooks/useInventoryConfig";

export type InventoryModalType = null | "addItem" | "addStock";

const Inventory: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [openModal, setOpenModal] = useState<InventoryModalType>(null);
  const [selectedItem, setSelectedItem] = useState<{
    uid: string;
    name: string;
  } | null>(null);

  const headers = ["SKU", "Item", "Total Qty", "Unit Price"];
  const columnTemplate = "[grid-template-columns:1fr_1fr_3.8rem_4rem]";

  const { items, setItems, errors, setErrors } = useInventoryItems(page);
  const { types } = useInventoryConfig();

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
            errors={errors}
            types={types}
            setErrors={setErrors}
            setItems={setItems}
            items={items}
            setOpenModal={setOpenModal}
          />
        </AddModal>
      )}
      <h2 className="self-start text-2xl font-semibold">Inventory</h2>
      <div className="flex flex-col gap-4 w-full">
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
          tableRowType={InventoryRow}
          getKey={(item) => item.sku}
          gap={10}
        />
      </div>
    </div>
  );
};

export default Inventory;
