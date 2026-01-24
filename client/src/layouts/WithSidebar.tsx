import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar/Sidebar";

const WithSidebar: React.FC = () => {
  return (
    <div className="flex bg-gray-50 h-screen w-screen">
      <Sidebar />
      <div className="flex flex-col w-full pr-8 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default WithSidebar;
