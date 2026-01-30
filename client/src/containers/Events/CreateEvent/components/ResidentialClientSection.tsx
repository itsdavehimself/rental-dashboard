import { PenSquare } from "lucide-react";
import { useAppDispatch } from "../../../../app/hooks";
import { openModal } from "../../../../app/slices/uiSlice";

interface ResidentialClientSectionProps<T extends string | null> {
  title: string;
  children: React.ReactNode;
  lastItem?: boolean;
  hideDividerOnLarge?: boolean;
  modalKey: T;
  minHeight?: number;
}

const ResidentialClientSection = <T extends string | null>({
  title,
  children,
  lastItem,
  hideDividerOnLarge,
  modalKey,
  minHeight,
}: ResidentialClientSectionProps<T>) => {
  const dispatch = useAppDispatch();

  return (
    <div>
      <div className="flex justify-between items-end">
        <h5 className="font-semibold 3xl:mt-2 4xl:mt-4">{title}</h5>
        <button
          onClick={() => dispatch(openModal(modalKey))}
          className="flex justify-center items-center text-gray-500 hover:text-primary hover:cursor-pointer transition-all duration-200"
        >
          <PenSquare className="w-4 h-4" />
        </button>
      </div>

      <div
        className={`flex flex-col text-sm mt-2 ${!lastItem && "4xl:mb-4"}`}
        style={{ minHeight: minHeight ? `${minHeight}rem` : undefined }}
      >
        {children}
      </div>
      {!lastItem && (
        <hr
          className={`text-gray-200 ${hideDividerOnLarge ? "3xl:hidden 4xl:block" : "block"}`}
        />
      )}
    </div>
  );
};

export default ResidentialClientSection;
