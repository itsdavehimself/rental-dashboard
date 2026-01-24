import type { AddressEntry } from "../../../../types/Address";
import { formatPhoneNumber } from "../../../../helpers/formatPhoneNumber";

interface AddressBlockProps {
  address: AddressEntry | null;
  type: "Billing" | "Delivery" | "Client";
}

const AddressBlock: React.FC<AddressBlockProps> = ({ address, type }) => {
  return (
    <section className="flex flex-col gap-1">
      {type !== "Client" && (
        <h4 className="font-semibold text-primary">{type} Address</h4>
      )}
      <div className="text-sm">
        <p>
          {address?.firstName} {address?.lastName}
        </p>
        <p>{formatPhoneNumber(address?.phoneNumber)}</p>
        <p>{address?.addressLine1}</p>
        {address?.addressLine2 && <p>{address?.addressLine2}</p>}
        <p>
          {address?.city}, {address?.state} {address?.zipCode}
        </p>
        <p>{address?.email}</p>
      </div>
    </section>
  );
};

export default AddressBlock;
