import type { ResidentialClient } from "../../../types/ResidentialClient";
import { Ellipsis } from "lucide-react";
import { formatDate } from "date-fns";

interface ResidentialClientCardProps {
  item: ResidentialClient;
  isLast: boolean;
  columnTemplate: string;
}

const ResidentialClientCard: React.FC<ResidentialClientCardProps> = ({
  item,
  isLast,
  columnTemplate,
}) => {
  return (
    <div
      className={`grid ${columnTemplate} items-center w-full gap-4 px-8 py-4 text-sm hover:bg-gray-50 hover:cursor-pointer transition-all duration-200 ${
        isLast ? "rounded-b-xl" : "border-b border-gray-200"
      }`}
    >
      <p>{item.lastName}</p>
      <p>{item.firstName} </p>
      <p>{item.phoneNumber}</p>
      <p>{formatDate(item.createdAt, "MMMM yyyy")} </p>
      <button className="flex justify-center text-gray-400 items-center w-full hover:cursor-pointer hover:text-primary transition-all duration-200">
        <Ellipsis className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ResidentialClientCard;
