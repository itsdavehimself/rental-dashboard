import XButton from "./XButton";
import type { ErrorsState } from "../../helpers/handleError";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeModal } from "../../app/slices/uiSlice";

interface LogisticsModalProps<T extends string | null> {
  title: string;
  children: React.ReactNode;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
  modalKey: T;
}

const LogisticsModal = <T extends string | null>({
  title,
  children,
  setErrors,
  modalKey,
}: LogisticsModalProps<T>) => {
  const ref = useRef<HTMLDivElement>(null);
  const activeModal = useAppSelector((state) => state.ui.activeModal);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeModal === modalKey &&
        !ref.current?.contains(event.target as Node)
      ) {
        dispatch(closeModal());
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [modalKey]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 h-full w-full z-5">
      <div
        ref={ref}
        className="relative bg-white h-fit w-fit lg:min-w-200 shadow-md rounded-2xl z-10 py-4"
      >
        <div className="flex justify-between items-center pl-6 pr-4">
          <h4 className="text-lg font-semibold">{title}</h4>
          <XButton setErrors={setErrors} />
        </div>
        {children}
      </div>
    </div>
  );
};

export default LogisticsModal;
