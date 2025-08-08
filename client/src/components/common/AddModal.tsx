import XButton from "./XButton";
import type React from "react";

interface AddModalProps {
  title: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  setErrors: React.Dispatch<React.SetStateAction<object | null>>;
}

const AddModal: React.FC<AddModalProps> = ({
  title,
  setIsModalOpen,
  children,
  setErrors,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 h-full w-full z-5">
      <div className="relative bg-white h-fit w-fit lg:min-w-120 shadow-md rounded-2xl z-10 py-4">
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
