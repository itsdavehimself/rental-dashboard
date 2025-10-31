import { useCreateEvent } from "../../../../context/useCreateEvent";
import type { AddressEntry } from "../../../../types/Address";
import { formatPhoneNumber } from "../../../../helpers/formatPhoneNumber";
import { SquarePen, Trash2 } from "lucide-react";
import { setAddressEntryAsPrimary } from "../../../../service/clientService";

interface AddressSelectCardProps {
  address: AddressEntry;
  type: "billing" | "delivery";
  setView: React.Dispatch<
    React.SetStateAction<"default" | "edit" | "add" | "delete">
  >;
  setAddressEntryUid: React.Dispatch<React.SetStateAction<string | null>>;
}

const apiUrl = import.meta.env.VITE_API_BASE_URL;

const AddressSelectCard: React.FC<AddressSelectCardProps> = ({
  address,
  type,
  setView,
  setAddressEntryUid,
}) => {
  const {
    setClient,
    eventBilling,
    eventDelivery,
    setEventBilling,
    setEventDelivery,
  } = useCreateEvent();

  const addressType = type === "billing" ? eventBilling : eventDelivery;
  const actionType = type === "billing" ? setEventBilling : setEventDelivery;

  const handleSetPrimary = async () => {
    if (!address) return;

    try {
      // setErrors(null);
      await setAddressEntryAsPrimary(apiUrl, address.uid, type);

      setClient((prev) => {
        if (!prev) return prev;

        const key =
          type === "billing" ? "billingAddresses" : "deliveryAddresses";

        const updatedAddresses = prev[key].map((a) => ({
          ...a,
          isPrimary: a.uid === address.uid,
        }));
        return { ...prev, [key]: updatedAddresses };
      });

      setView("default");
    } catch (err) {
      // handleError(err, setErrors);
    }
  };

  return (
    <div
      className={`group grid grid-cols-[1fr_6rem] justify-center gap-1.5 p-2 border-1 rounded-lg min-h-[10rem] transition-all duration-200 ${
        address.uid === addressType?.uid
          ? "border-primary text-primary"
          : "border-gray-300 text-gray-500 hover:border-primary hover:cursor-pointer hover:text-primary"
      }`}
      onClick={() => actionType(address)}
    >
      <div className="flex flex-col text-sm transition-all duration-200">
        <p className="font-semibold">
          {address.firstName} {address.lastName}
        </p>
        <p>{formatPhoneNumber(address.phoneNumber)}</p>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} {address.zipCode}
        </p>
        <p>{address.email}</p>

        <div className="flex items-end h-full">
          {address.isPrimary ? (
            <p className="text-xs font-semibold self-end bg-sky-200 text-sky-700 rounded-xl w-fit py-0.5 px-2 justify-center items-center">
              Primary
            </p>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSetPrimary();
              }}
              className="self-end justify-center items-center text-xs w-fit font-semibold text-gray-500 hover:text-primary hover:cursor-pointer transition-all duration-200"
            >
              Set as Primary
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col h-full">
        <div className="flex gap-2 h-full items-start justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setView("edit");
              setAddressEntryUid(address.uid);
            }}
            className="text-gray-500 hover:text-primary hover:cursor-pointer transition-colors duration-200"
          >
            <SquarePen className="h-4 w-4" />
          </button>
          {!address.isPrimary && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (address.uid !== addressType?.uid) {
                  setView("delete");
                  setAddressEntryUid(address.uid);
                }
              }}
              className={`transition-colors duration-200 ${
                address.uid === addressType?.uid
                  ? "text-gray-300 hover:text-gray-300 hover:cursor-default"
                  : "text-gray-500 hover:text-primary hover:cursor-pointer"
              }`}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSelectCard;
