import XButton from "../../../components/common/XButton";
import { useRef, useEffect, useState } from "react";
import { handleError, type ErrorsState } from "../../../helpers/handleError";
import DebouncedSearchBar from "../../../components/common/DebouncedSearchBar";
import { UserRoundPlus } from "lucide-react";
import LinkButton from "../../../components/common/LinkButton";
import type { ClientDetail } from "../types/Client";
import { useDebounce } from "../../../hooks/useDebounce";
import { searchClients } from "../services/clientService";
import { useToast } from "../../../hooks/useToast";
import ClientSearchResultRow from "./ClientSearchResultRow";
import ClientInputChip from "../../../components/common/ClientInputChip";
import ActionButton from "../../../components/common/ActionButton";
import { useCreateEvent } from "../../Events/hooks/useCreateEvent";
import { useNavigate } from "react-router";

interface SearchClientsProps<T extends string | null> {
  openModal: T | null;
  setOpenModal: React.Dispatch<React.SetStateAction<T | null>>;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
  title: string;
  label: string;
  mode: "create" | "update";
}

const SearchClients = <T extends string | null>({
  openModal,
  setOpenModal,
  setErrors,
  title,
  label,
  mode,
}: SearchClientsProps<T>) => {
  const ref = useRef<HTMLDivElement>(null);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();
  const { setClient, eventUid } = useCreateEvent();

  const [clients, setClients] = useState<ClientDetail[]>([]);
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(
    null
  );

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const clientList = await searchClients(apiUrl, page, query);
      setClients(clientList.data);
      setIsLoading(false);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching the client list.");
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();

  const debouncedSearch = useDebounce(handleSearch, 750);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openModal === "searchClient" &&
        setOpenModal &&
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
            <h4 className="text-lg font-semibold">{title}</h4>
            <p className="text-sm text-gray-500">
              Search for a client by phone number, email, name, or business name
            </p>
          </div>

          <XButton setIsModalOpen={setOpenModal} setErrors={setErrors} />
        </div>
        <div className="flex flex-col justify-center items-center px-12">
          <div className="relative grid grid-cols-[1fr_3rem] w-full gap-4 h-fit max-h-72">
            {!selectedClient ? (
              <DebouncedSearchBar<ClientDetail>
                placeholder="Search"
                results={clients}
                setResults={setClients}
                search={query}
                setSearch={setQuery}
                debouncedSearch={debouncedSearch}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                renderResult={(client) => (
                  <ClientSearchResultRow
                    key={client.uid}
                    client={client}
                    setSelectedClient={setSelectedClient}
                    setQuery={setQuery}
                  />
                )}
              />
            ) : (
              <ClientInputChip
                name={`${selectedClient.firstName} ${selectedClient.lastName}`}
                setSelectedClient={setSelectedClient}
              />
            )}
            <button className="flex justify-center items-center hover:cursor-pointer text-gray-400 hover:text-primary transition-all duration-200">
              <UserRoundPlus />
            </button>
          </div>
        </div>
        <div className="flex justify-end w-full px-6">
          {mode === "create" ? (
            <LinkButton
              to={`/events/create?clientId=${selectedClient?.uid}`}
              label={label}
              disabled={!selectedClient}
            />
          ) : (
            <ActionButton
              label={label}
              style="filled"
              onClick={() => {
                setClient(selectedClient);
                setOpenModal(null);
                navigate(
                  `${
                    eventUid
                      ? `/events/create?clientId=${selectedClient?.uid}&eventId=${eventUid}`
                      : `/events/create?clientId=${selectedClient?.uid}`
                  }`,
                  {
                    replace: true,
                  }
                );
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default SearchClients;
