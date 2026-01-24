import { useNavigate } from "react-router";
import AddressBlock from "./AddressBlock";
import { useEventDetails } from "../../hooks/useEventDetails";

const ClientDetails: React.FC = () => {
  const navigate = useNavigate();

  const { client } = useEventDetails();
  const primaryBilling =
    client?.billingAddresses?.find((a) => a.isPrimary) ?? null;

  return (
    <section className="flex flex-col flex-grow gap-6 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
      <div className="flex flex-row justify-between items-center">
        <h3 className="text-lg font-semibold text-primary">
          Client Information
        </h3>
        <button
          onClick={() => navigate(`/clients/${client?.uid}`)}
          className="text-xs text-gray-500 font-semibold hover:text-primary hover:cursor-pointer transition-colors duration-200"
        >
          View Client
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <AddressBlock address={primaryBilling} type="Client" />
        </div>
        <div>
          <h5 className="text-sm font-semibold">Notes</h5>
          <p className="text-sm">{client?.notes}</p>
        </div>
      </div>
    </section>
  );
};

export default ClientDetails;
