import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";
import { useAppSelector } from "../app/hooks";
import { greeting } from "../helpers/greeting";
import { UserCircle } from "lucide-react";

const WithSidebar: React.FC = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <div className="flex bg-gray-50 h-screen w-screen">
      <Sidebar />
      <div className="flex flex-col w-full pr-8 pb-8">
        <div className="flex justify-end items-center h-18 gap-4">
          <p className="text-sm">
            {greeting()}, {user?.firstName}
          </p>
          <div className="hover:cursor-pointer">
            <UserCircle className="h-7 w-7" />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default WithSidebar;
