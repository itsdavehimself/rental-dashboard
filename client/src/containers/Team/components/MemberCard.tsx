import { formatDistanceToNowStrict } from "date-fns";
import type { User } from "../../../types/User";
import { Ellipsis } from "lucide-react";

interface MemberCardProps {
  item: User;
  isLast: boolean;
  columnTemplate: string;
}

const MemberCard: React.FC<MemberCardProps> = ({
  item,
  isLast,
  columnTemplate,
}) => {
  return (
    <div
      className={`grid ${columnTemplate} items-center w-full gap-4 px-8 py-4 text-sm hover:bg-gray-50 hover:cursor-pointer transition-all duration-200 ${
        isLast ? "" : "border-b border-gray-200"
      }`}
    >
      <p>
        {item.firstName} {item.lastName}
      </p>
      <p>{item.jobTitle}</p>
      <p>{item.phoneNumber}</p>
      <p>{formatDistanceToNowStrict(item.startDate)} ago</p>
      <button className="flex justify-center text-gray-400 items-center w-full hover:cursor-pointer hover:text-primary transition-all duration-200">
        <Ellipsis className="h-5 w-5" />
      </button>
    </div>
  );
};

export default MemberCard;
