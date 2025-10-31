import { PenSquare } from "lucide-react";

interface ResidentialClientSectionProps<T extends string | null> {
  title: string;
  children: React.ReactNode;
  lastItem?: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<T>>;
  modalKey: T;
  minHeight?: number;
}

const ResidentialClientSection = <T extends string | null>({
  title,
  children,
  lastItem,
  setOpenModal,
  modalKey,
  minHeight,
}: ResidentialClientSectionProps<T>) => {
  return (
    <>
      <div className="flex justify-between items-end">
        <h5 className="font-semibold mt-4">{title}</h5>
        <button
          onClick={() => setOpenModal(modalKey)}
          className="flex justify-center items-center text-gray-500 hover:text-primary hover:cursor-pointer transition-all duration-200"
        >
          <PenSquare className="w-4 h-4" />
        </button>
      </div>

      <div
        className={`flex flex-col text-sm mt-2 ${!lastItem && "mb-4"}`}
        style={{ minHeight: minHeight ? `${minHeight}rem` : undefined }}
      >
        {children}
      </div>
      {!lastItem && <hr className="text-gray-200" />}
    </>
  );
};

export default ResidentialClientSection;
