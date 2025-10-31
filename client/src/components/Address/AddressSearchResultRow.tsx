import type { AddressResult } from "../../types/Address";
import type {
  UseFormSetValue,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

interface AddressSearchResultRow<T extends FieldValues> {
  address: AddressResult;
  setValue: UseFormSetValue<T>;
  setResults: React.Dispatch<React.SetStateAction<AddressResult[]>>;
  fieldMap: {
    addressLine1: Path<T>;
    city: Path<T>;
    state: Path<T>;
    zipCode: Path<T>;
  };
}

const AddressSearchResultRow = <T extends FieldValues>({
  address,
  setValue,
  setResults,
  fieldMap,
}: AddressSearchResultRow<T>) => {
  return (
    <div
      onClick={() => {
        setValue(
          fieldMap.addressLine1,
          address.addressLine1 as PathValue<T, typeof fieldMap.addressLine1>
        );
        setValue(
          fieldMap.city,
          address.city as PathValue<T, typeof fieldMap.city>
        );
        setValue(
          fieldMap.state,
          address.state as PathValue<T, typeof fieldMap.state>
        );
        setValue(
          fieldMap.zipCode,
          address.zipCode as PathValue<T, typeof fieldMap.zipCode>
        );
        setResults([]);
      }}
      className="grid grid-cols-[1fr_.2fr] items-center px-4 h-12 text-sm text-gray-500 hover:text-primary hover:bg-gray-50 hover:cursor-pointer"
    >
      <div className="flex flex-col">
        <p className="font-semibold">{address.addressLine1}</p>
        <p className="text-xs text-gray-500">
          {address.city}, {address.state} {address.zipCode}
        </p>
      </div>
    </div>
  );
};

export default AddressSearchResultRow;
