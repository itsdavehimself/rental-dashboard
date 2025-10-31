import { useRef } from "react";
import XButton from "./XButton";
import ActionButton from "./ActionButton";

interface DeleteModalProps {
  title: string;
  label: string;
  setView: React.Dispatch<
    React.SetStateAction<"default" | "edit" | "add" | "delete">
  >;
  cancelAction: () => void;
  deleteAction: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  label,
  setView,
  cancelAction,
  deleteAction,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 h-full w-full z-5">
      <div
        ref={ref}
        className="relative bg-white h-fit w-fit lg:min-w-120 shadow-md rounded-2xl z-10 py-4"
      >
        <div className="flex justify-between items-center pl-6 pr-4">
          <h4 className="text-lg font-semibold">{title}</h4>
          <XButton
            onClick={() => {
              setView("default");
            }}
          />
        </div>
        <div className="flex flex-col gap-6 px-6 pt-4 pb-2">
          <p className="text-sm">
            Are you sure you want to delete this {label}?
          </p>
          <div className="flex justify-end gap-4 w-full">
            <ActionButton
              label="Cancel"
              onClick={cancelAction}
              style="outline"
            />
            <ActionButton
              label="Delete"
              onClick={deleteAction}
              style="filled"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
