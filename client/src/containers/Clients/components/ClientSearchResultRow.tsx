import { formatAddress } from "../../../helpers/formatAddress";
import { formatPhoneNumber } from "../../../helpers/formatPhoneNumber";
import type { ClientSearchResult } from "../../../types/Client";

interface ClientSearchResultRowProps {
  client: ClientSearchResult;
  setSelectedClient: React.Dispatch<
    React.SetStateAction<{ uid: string; name: string } | null>
  >;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}

const ClientSearchResultRow: React.FC<ClientSearchResultRowProps> = ({
  client,
  setSelectedClient,
  setQuery,
}) => {
  const clientType = client.type;

  return (
    <div
      onClick={() => {
        setSelectedClient({
          uid: client.uid,
          name: `${client.firstName} ${client.lastName}`,
        });
        setQuery("");
      }}
      key={client.uid}
      className="grid grid-cols-[1fr_.2fr] items-center px-4 h-24 text-sm text-gray-500 hover:text-primary hover:bg-gray-50 hover:cursor-pointer"
    >
      <div className="flex flex-col">
        <p className="font-semibold">
          {client.firstName} {client.lastName}
        </p>
        <p>{formatPhoneNumber(client.phoneNumber)}</p>
        <p className="text-xs text-gray-500">{client.email}</p>
        <p className="text-xs text-gray-500">
          {formatAddress(client.billingAddress)}
        </p>
      </div>
      <div
        className={`flex justify-center px-3 py-1 text-xs rounded-2xl ${
          clientType === "Residential"
            ? "bg-green-200 text-green-800 font-semibold"
            : "bg-blue-200 text-blue-800 font-semibold"
        }`}
      >
        {clientType}
      </div>
    </div>
  );
};

export default ClientSearchResultRow;
