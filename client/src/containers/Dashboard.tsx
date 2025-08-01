import { useAppSelector } from "../app/hooks";

const Dashboard: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);
  return <div>Welcome, {user?.firstName}</div>;
};

export default Dashboard;
