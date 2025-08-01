import { Home, Boxes, PartyPopper, Handshake, Users } from "lucide-react";
import NavBtn from "./NavBtn";

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col w-1/3 md:max-w-80 px-4">
      <div className="flex h-18 px-4 items-center gap-3 mb-6">
        <div className="text-white bg-black p-2 rounded-xl">
          <PartyPopper fill="white" />
        </div>
        <h4 className="font-bold text-lg">AD Rentals</h4>
      </div>
      <div className="flex flex-col gap-2">
        <NavBtn icon={Home} label="Dashboard" path="/dashboard" />
        <NavBtn icon={Boxes} label="Inventory" path="/inventory" />
        <NavBtn icon={PartyPopper} label="Events" path="/events" />
        <NavBtn icon={Handshake} label="Clients" path="/clients" />
        <NavBtn icon={Users} label="Team" path="/team" />
      </div>
    </div>
  );
};

export default Sidebar;
