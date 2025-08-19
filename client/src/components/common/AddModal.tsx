import XButton from "./XButton";
import type { ErrorsState } from "../../helpers/handleError";
import { useEffect, useRef } from "react";

interface AddModalProps<T extends string | null> {
  openModal: string | null;
  setOpenModal: React.Dispatch<React.SetStateAction<T>>;
  title: string;
  children: React.ReactNode;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
  modalKey: T;
}

const AddModal = <T extends string | null>({
  openModal,
  setOpenModal,
  title,
  children,
  setErrors,
  modalKey,
}: AddModalProps<T>) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openModal === modalKey &&
        !ref.current?.contains(event.target as Node)
      ) {
        setOpenModal(null as T);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openModal, modalKey, setOpenModal]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 h-full w-full z-5">
      <div
        ref={ref}
        className="relative bg-white h-fit w-fit lg:min-w-120 shadow-md rounded-2xl z-10 py-4"
      >
        <div className="flex justify-between items-center pl-6 pr-4">
          <h4 className="text-lg font-semibold">{title}</h4>
          <XButton setIsModalOpen={setOpenModal} setErrors={setErrors} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default AddModal;
