import { formatDistanceToNowStrict } from "date-fns";
import type { User } from "../../../types/User";

interface MemberCardProps {
  user: User;
}

const MemberCard: React.FC<MemberCardProps> = ({ user }) => {
  return (
    <div className="grid grid-cols-5 w-full gap-4">
      <p>
        {user.firstName} {user.lastName}
      </p>
      <p>{user.jobTitle}</p>
      <p>{user.phoneNumber}</p>
      <p>{formatDistanceToNowStrict(user.startDate)} ago</p>
      <button className="hover:cursor-pointer">Edit</button>
    </div>
  );
};

export default MemberCard;
