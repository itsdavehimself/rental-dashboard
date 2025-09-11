import { PenSquare } from "lucide-react";

interface ResidentialClientSectionProps {
  title: string;
  children: React.ReactNode;
  lastItem?: boolean;
}

const ResidentialClientSection: React.FC<ResidentialClientSectionProps> = ({
  title,
  children,
  lastItem,
}) => {
  return (
    <>
      <div className="flex justify-between items-end">
        <h5 className="font-semibold mt-6">{title}</h5>
        <button className="flex justify-center items-center text-gray-500 hover:text-primary hover:cursor-pointer transition-all duration-200">
          <PenSquare className="w-4 h-4" />
        </button>
      </div>

      <div className={`flex flex-col text-sm mt-4 ${!lastItem && "mb-6"}`}>
        {children}
      </div>
      {!lastItem && <hr className="text-gray-200" />}
    </>
  );
};

export default ResidentialClientSection;
