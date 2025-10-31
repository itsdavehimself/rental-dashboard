import { X } from "lucide-react";
import type { ClientSearchResult } from "../../types/Client";

interface ClientInputChipProps {
  name: string;
  setSelectedClient: React.Dispatch<
    React.SetStateAction<ClientSearchResult | null>
  >;
}

const ClientInputChip: React.FC<ClientInputChipProps> = ({
  name,
  setSelectedClient,
}) => {
  return (
    <div
      onClick={() => setSelectedClient(null)}
      className="grid grid-cols-[1fr_1rem] items-center ring-1 h-10 px-4 rounded-lg ring-gray-300 bg-white"
    >
      <p className="text-sm font-semibold">{name}</p>
      <button className="flex justify-center items-center text-gray-500 hover:cursor-pointer hover:text-primary transition-all duration-200">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ClientInputChip;
