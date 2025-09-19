import type { AddressResult } from "../../types/Address";
import { type ResidentialClientInputs } from "../../containers/Clients/components/ResidentialClientForm";
import type { UseFormSetValue } from "react-hook-form";

interface AddressSearchResultRow {
  address: AddressResult;
  setValue: UseFormSetValue<ResidentialClientInputs>;
  setResults: React.Dispatch<React.SetStateAction<AddressResult[]>>;
}

const AddressSearchResultRow: React.FC<AddressSearchResultRow> = ({
  address,
  setValue,
  setResults,
}) => {
  return (
    <div
      onClick={() => {
        setValue("address.street", address.street);
        setValue("address.city", address.city);
        setValue("address.state", address.state);
        setValue("address.zipCode", address.zipCode);
        setResults([]);
      }}
      key={`${address.street}-${address.city}-${address.zipCode}`}
      className="grid grid-cols-[1fr_.2fr] items-center px-4 h-12 text-sm text-gray-500 hover:text-primary hover:bg-gray-50 hover:cursor-pointer"
    >
      <div className="flex flex-col">
        <p className="font-semibold">{address.street}</p>
        <p className="text-xs text-gray-500">
          {address.city}, {address.state} {address.zipCode}
        </p>
      </div>
    </div>
  );
};

export default AddressSearchResultRow;
