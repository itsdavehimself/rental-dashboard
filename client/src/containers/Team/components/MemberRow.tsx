import { formatDistanceToNowStrict } from "date-fns";
import type { User } from "../types/User";
import { formatPhoneNumber } from "../../../helpers/formatPhoneNumber";

interface MemberRowProps {
  item: User;
  isLast: boolean;
  columnTemplate: string;
  gap: number;
}

const MemberRow: React.FC<MemberRowProps> = ({
  item,
  isLast,
  columnTemplate,
  gap,
}) => {
  return (
    <div
      className={`grid ${columnTemplate} items-center w-full gap-${gap} px-8 py-4 text-sm hover:bg-gray-50 hover:cursor-pointer transition-all duration-200 ${
        isLast ? "rounded-b-xl" : "border-b border-gray-200"
      }`}
    >
      <p>
        {item.firstName} {item.lastName}
      </p>
      <p>{item.jobTitle}</p>
      <p>{formatPhoneNumber(item.phoneNumber)}</p>
      <p>{formatDistanceToNowStrict(item.startDate)} ago</p>
    </div>
  );
};

export default MemberRow;
