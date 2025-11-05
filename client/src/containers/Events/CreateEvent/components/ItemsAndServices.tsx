import DebouncedSearchBar from "../../../../components/common/DebouncedSearchBar";
import { useState, useRef } from "react";
import { useToast } from "../../../../hooks/useToast";
import { handleError, type ErrorsState } from "../../../../helpers/handleError";
import { useDebounce } from "../../../../hooks/useDebounce";
import { searchInventory } from "../../../Inventory/services/inventoryService";
import { type InventoryItemSearchResult } from "../../../Inventory/types/InventoryItem";
import ItemSearchResultRow from "./ItemSearchResultRow";
import SelectedItemRow from "./SelectedItemRow";
import { useCreateEvent } from "../../hooks/useCreateEvent";

const ItemsAndServices: React.FC = () => {
  const { addToast } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { selectedItems, setSelectedItems } = useCreateEvent();

  const [inventoryItemResults, setInventoryItemResults] = useState<
    InventoryItemSearchResult[]
  >([]);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const results = await searchInventory(apiUrl, page, query);
      setInventoryItemResults(results.data);
      setIsLoading(false);
    } catch (err) {
      // handleError(err, setErrors);
      addToast("Error", "There was a problem fetching the search results.");
      setIsLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 750);

  return (
    <section className="flex flex-col flex-grow gap-4 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
      <h4 className="font-semibold text-lg">Items & Services</h4>
      <div className="flex flex-col justify-center">
        <DebouncedSearchBar
          placeholder="Search"
          results={inventoryItemResults}
          setResults={setInventoryItemResults}
          search={query}
          setSearch={setQuery}
          debouncedSearch={debouncedSearch}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          renderResult={(item) => (
            <ItemSearchResultRow
              key={item.uid}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
              item={item}
              setQuery={setQuery}
            />
          )}
        />
      </div>
      {selectedItems && selectedItems.length > 0 && (
        <section className="flex flex-col">
          <h6 className="font-semibold mb-2">Items</h6>
          {selectedItems.map((item) => (
            <SelectedItemRow
              key={item.uid}
              item={item}
              selectedItems={selectedItems}
              setSelectedItems={setSelectedItems}
            />
          ))}
        </section>
      )}
    </section>
  );
};

export default ItemsAndServices;
