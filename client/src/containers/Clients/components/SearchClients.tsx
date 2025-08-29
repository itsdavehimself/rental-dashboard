import XButton from "../../../components/common/XButton";
import { useRef, useEffect, useState } from "react";
import { handleError, type ErrorsState } from "../../../helpers/handleError";
import DebouncedSearchBar from "../../../components/common/DebouncedSearchBar";
import type { EventModalType } from "../../Events/EventsDashboard/Events";
import { UserRoundPlus } from "lucide-react";
import LinkButton from "../../../components/common/LinkButton";
import type { ClientSearchResult } from "../../../types/Client";
import { useDebounce } from "../../../hooks/useDebounce";
import { searchClients } from "../../../service/clientService";
import { useToast } from "../../../hooks/useToast";

interface SearchClientsProps {
  openModal: string | null;
  setOpenModal: React.Dispatch<React.SetStateAction<EventModalType>>;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
}

const SearchClients: React.FC<SearchClientsProps> = ({
  openModal,
  setOpenModal,
  setErrors,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();

  const [clients, setClients] = useState<ClientSearchResult[]>([]);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");

  const handleSearch = async () => {
    try {
      const clientList = await searchClients(apiUrl, page, query);
      setClients(clientList.data);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching the client list.");
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 1250);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openModal === "searchClient" &&
        !ref.current?.contains(event.target as Node)
      ) {
        setOpenModal(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openModal, setOpenModal]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 h-full w-full z-5">
      <div
        ref={ref}
        className="flex flex-col relative bg-white h-fit w-1/2 max-w-200 lg:min-w-120 shadow-md rounded-2xl z-10 py-4 gap-8"
      >
        <div className="flex justify-between items-center pl-6 pr-4">
          <div className="flex flex-col">
            <h4 className="text-lg font-semibold">Create an Event</h4>
            <p className="text-sm text-gray-500">
              Search for a client by phone number, email, name, or business name
            </p>
          </div>

          <XButton setIsModalOpen={setOpenModal} setErrors={setErrors} />
        </div>
        <div className="flex flex-col justify-center items-center px-12">
          <div className="grid grid-cols-[1fr_3rem] w-full gap-4">
            <DebouncedSearchBar
              placeholder="Search"
              setResults={setClients}
              search={query}
              setSearch={setQuery}
              debouncedSearch={debouncedSearch}
            />
            <button className="flex justify-center items-center hover:cursor-pointer text-gray-400 hover:text-primary transition-all duration-200">
              <UserRoundPlus />
            </button>
          </div>
        </div>
        <div className="flex justify-end w-full px-6">
          <LinkButton label="Select Client" />
        </div>
      </div>
    </div>
  );
};
export default SearchClients;
