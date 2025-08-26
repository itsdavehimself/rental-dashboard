import SearchBar from "../../components/common/SearchBar";
import LinkButton from "../../components/common/LinkButton";
import Table from "../../components/Table/Table";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import EventCard from "./components/EventCard";

const Events: React.FC = () => {
  const headers = [
    "Dates",
    "Client",
    "Name",
    "Location",
    "Items",
    "Lead",
    "Paid",
    "Status",
    "Notes",
    "",
  ];
  const columnTemplate =
    "[grid-template-columns:1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_3rem]";

  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState();

  return (
    <div className="flex flex-col items-center bg-white h-screen w-full shadow-md rounded-3xl p-8 gap-6">
      <div className="flex flex-col gap-4 w-full xl:w-2/3">
        <div className="flex justify-between w-full">
          <SearchBar placeholder="Search" />
          <LinkButton Icon={Plus} label="Event" />
        </div>
        <Table
          columnTemplate={columnTemplate}
          headers={headers}
          tableItems={events}
          tableCardType={EventCard}
          getKey={(item) => item.sku}
          gap={10}
          setOpenModal={setOpenModal}
        />
      </div>
    </div>
  );
};

export default Events;
