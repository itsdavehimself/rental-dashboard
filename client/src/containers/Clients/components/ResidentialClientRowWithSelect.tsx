import type { ResidentialClient } from "../../../types/Client";
import SelectButton from "../../../components/common/SelectButton";
import { formatPhoneNumber } from "../../../helpers/formatPhoneNumber";

interface ResidentialClientRowWithSelectProps {
  item: ResidentialClient;
  isLast: boolean;
  columnTemplate: string;
  selectButton: boolean;
  gap: number;
}

const ResidentialClientRowWithSelect: React.FC<
  ResidentialClientRowWithSelectProps
> = ({ item, isLast, columnTemplate, gap }) => {
  return (
    <div
      className={`grid ${columnTemplate} items-center w-full gap-${gap} px-8 py-4 text-sm transition-all duration-200 ${
        isLast ? "rounded-b-xl" : "border-b border-gray-200"
      }`}
    >
      <p>{item.lastName}</p>
      <p>{item.firstName} </p>
      <p>{formatPhoneNumber(item.phoneNumber)}</p>
      <p>
        {item.billingAddress.street} {item.billingAddress.unit}
        {item.billingAddress.city}, {item.billingAddress.state}{" "}
        {item.billingAddress.zipCode}
      </p>
      <SelectButton
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />
    </div>
  );
};

export default ResidentialClientRowWithSelect;
