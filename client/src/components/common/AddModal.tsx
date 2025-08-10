import XButton from "./XButton";
import type { ErrorsState } from "../../helpers/handleError";
import { useEffect, useRef } from "react";

interface AddModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
}

const AddModal: React.FC<AddModalProps> = ({
  openModal,
  setOpenModal,
  title,
  setIsModalOpen,
  children,
  setErrors,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openModal && !ref.current?.contains(event.target as Node)) {
        setOpenModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 h-full w-full z-5">
      <div
        ref={ref}
        className="relative bg-white h-fit w-fit lg:min-w-120 shadow-md rounded-2xl z-10 py-4"
      >
        <div className="flex justify-between items-center pl-6 pr-4">
          <h4 className="text-lg font-semibold">{title}</h4>
          <XButton setIsModalOpen={setIsModalOpen} setErrors={setErrors} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AddModal;
