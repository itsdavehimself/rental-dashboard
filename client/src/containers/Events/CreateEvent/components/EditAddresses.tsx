import { useState, useRef, useEffect } from "react";
import XButton from "../../../../components/common/XButton";
import { type ErrorsState } from "../../../../helpers/handleError";
import { useCreateEvent } from "../../../../context/useCreateEvent";
import AddressSelectCard from "./AddressSelectCard";
import DeleteModal from "../../../../components/common/DeleteModal";
import { deleteAddressEntry } from "../../../../service/clientService";
import { useToast } from "../../../../hooks/useToast";
import AddressBookForm from "./AddressBookForm";

interface EditAddressesProps {
  type: "billing" | "delivery";
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
}

const EditAddresses: React.FC<EditAddressesProps> = ({ type, setErrors }) => {
  const [view, setView] = useState<"default" | "edit" | "add" | "delete">(
    "default"
  );
  const formattedType = type.charAt(0).toUpperCase() + type.slice(1);
  const [title, setTitle] = useState<string>(`${formattedType} Addresses`);
  const ref = useRef<HTMLDivElement>(null);
  const { client, setClient, setOpenModal } = useCreateEvent();
  const [addressEntryUid, setAddressEntryUid] = useState<string | null>(null);
  const addresses =
    type === "billing" ? client?.billingAddresses : client?.deliveryAddresses;

  const { addToast } = useToast();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenModal(null);
        setErrors(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpenModal, setErrors]);

  const handleDelete = async (addressEntryUid: string | null) => {
    if (!client) return;
    if (!addressEntryUid) return;

    try {
      setErrors(null);
      await deleteAddressEntry(apiUrl, addressEntryUid);

      setClient((prev) => {
        if (!prev) return prev;

        const key =
          type === "billing" ? "billingAddresses" : "deliveryAddresses";

        const updatedAddresses = prev[key]
          .filter((a) => a.uid !== addressEntryUid)
          .sort((a, b) => {
            if (a.isPrimary && !b.isPrimary) return -1;
            if (!a.isPrimary && b.isPrimary) return 1;
            return a.addressLine1.localeCompare(b.addressLine1);
          });

        return { ...prev, [key]: updatedAddresses };
      });

      setView("default");
      addToast(
        "Success",
        `${
          type.charAt(0).toUpperCase() + type.slice(1)
        } address successfully deleted.`
      );
    } catch (err) {
      // handleError(err, setErrors);
    }
  };

  return (
    <div
      ref={ref}
      className="relative bg-white h-fit w-fit lg:min-w-120 shadow-md rounded-2xl z-10 py-4"
    >
      <div className="flex justify-between items-center pl-6 pr-4">
        <h4 className="text-lg font-semibold">{title}</h4>
        {view === "default" ? (
          <XButton setIsModalOpen={setOpenModal} setErrors={setErrors} />
        ) : (
          <XButton
            onClick={() => {
              setView("default");
              setTitle(`${formattedType} Addresses`);
            }}
          />
        )}
      </div>
      {view === "add" && (
        <AddressBookForm
          type={type}
          setView={setView}
          addressEntryUid={addressEntryUid}
          mode="add"
        />
      )}
      {view == "edit" && (
        <AddressBookForm
          type={type}
          setView={setView}
          addressEntryUid={addressEntryUid}
          mode="edit"
        />
      )}
      {view === "delete" && (
        <DeleteModal
          title={`Delete ${formattedType} Address`}
          label={`${type} address`}
          setView={setView}
          cancelAction={() => setView("default")}
          deleteAction={() => handleDelete(addressEntryUid)}
        />
      )}
      {view === "default" && (
        <div className="flex flex-col gap-4 px-6 pt-4 pb-2">
          <div className="grid grid-cols-2 gap-4">
            {addresses?.map((address, i) => (
              <AddressSelectCard
                key={i}
                address={address}
                type={type}
                setView={setView}
                setAddressEntryUid={setAddressEntryUid}
              />
            ))}

            <button
              onClick={() => {
                setView("add");
                setTitle(`Add ${formattedType} Address`);
              }}
              className="min-h-[10rem] border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-gray-500 hover:border-primary hover:text-primary hover:cursor-pointer transition-all duration-200"
            >
              <span className="text-sm font-semibold">
                + Add {formattedType} Address
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditAddresses;
