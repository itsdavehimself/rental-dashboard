import ItemRow from "./ItemRow";
import { useEventDetails } from "../../hooks/useEventDetails";
import { useNavigate } from "react-router";

const EventItems: React.FC = () => {
  const { fetchedEvent } = useEventDetails();
  const navigate = useNavigate();

  if (!fetchedEvent) {
    navigate("/dashboard");
    return;
  }

  return (
    <section className="flex flex-col flex-grow gap-6 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
      <h3 className="text-lg font-semibold text-primary">Event Items</h3>
      <div className="grid grid-cols-[1fr_4rem_4rem_4rem] gap-14 justify-between items-center text-sm text-primary">
        <p className="font-semibold">Item</p>
        <p className="font-semibold text-right">Quantity</p>
        <p className="font-semibold text-right">Price/Unit</p>
        <p className="font-semibold text-right">Total</p>
      </div>
      {fetchedEvent.items.map((i) => (
        <ItemRow key={i.uid} item={i} />
      ))}
    </section>
  );
};

export default EventItems;
