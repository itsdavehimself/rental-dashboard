import type { ResidentialClient } from "../../../types/Client";
import { useNavigate } from "react-router";
import { formatPhoneNumber } from "../../../helpers/formatPhoneNumber";

interface ResidentialClientRowProps {
  item: ResidentialClient;
  isLast: boolean;
  columnTemplate: string;
  gap: number;
}

const ResidentialClientRow: React.FC<ResidentialClientRowProps> = ({
  item,
  isLast,
  columnTemplate,
  gap,
}) => {
  const navigate = useNavigate();
  return (
    <div
      className={`grid ${columnTemplate} items-center w-full gap-${gap} px-8 py-4 text-sm hover:bg-gray-50 hover:cursor-pointer transition-all duration-200 ${
        isLast ? "rounded-b-xl" : "border-b border-gray-200"
      }`}
      onClick={() => navigate(`${item.uid}`)}
    >
      <p>{item.lastName}</p>
      <p>{item.firstName} </p>
      <p>{formatPhoneNumber(item.phoneNumber)}</p>
      <p>
        {item.billingAddress.street} {item.billingAddress.unit}
        {item.billingAddress.city}, {item.billingAddress.state}{" "}
        {item.billingAddress.zipCode}
      </p>
    </div>
  );
};

export default ResidentialClientRow;
