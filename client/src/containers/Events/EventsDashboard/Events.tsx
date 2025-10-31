import SearchBar from "../../../components/common/DebouncedSearchBar";
import Table from "../../../components/Table/Table";
import { Plus } from "lucide-react";
import { useState } from "react";
import EventRow from "../EventsDashboard/components/EventRow";
import AddButton from "../../../components/common/AddButton";
import SearchClients from "../../Clients/components/SearchClients";
import { type ErrorsState } from "../../../helpers/handleError";

export type EventModalType = null | "searchClient" | "addClient";

const Events: React.FC = () => {
  const headers = [
    "Client",
    "Name",
    "Delivery",
    "Pick Up",
    "Items",
    "Location",
    "Paid",
    "Status",
    "Notes",
  ];
  const columnTemplate =
    "[grid-template-columns:1fr_1fr_1fr_1fr_1fr_1fr_.4fr_.4fr_.4fr]";

  const [events, setEvents] = useState([]);
  const [errors, setErrors] = useState<ErrorsState>(null);
  const [openModal, setOpenModal] = useState<EventModalType>(null);

  return (
    <div className="flex flex-col items-center bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      {openModal === "searchClient" && (
        <SearchClients<EventModalType>
          openModal={openModal}
          setOpenModal={setOpenModal}
          setErrors={setErrors}
          title="Create an Event"
          label="Create Event"
          mode="create"
        />
      )}
      <h2 className="self-start text-2xl font-semibold">Events</h2>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex justify-between w-full">
          <SearchBar placeholder="Search" />
          <AddButton<EventModalType>
            Icon={Plus}
            label="Event"
            addModalOpen={setOpenModal}
            modalKey="searchClient"
          />
        </div>
        <Table
          columnTemplate={columnTemplate}
          headers={headers}
          tableItems={events}
          tableRowType={EventRow}
          getKey={(item) => item.sku}
          gap={10}
        />
      </div>
    </div>
  );
};

export default Events;
