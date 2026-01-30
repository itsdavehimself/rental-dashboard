import type { LucideIcon } from "lucide-react";
import { useAppDispatch } from "../../app/hooks";
import { openModal } from "../../app/slices/uiSlice";

interface AddButtonProps<T extends string | null> {
  label: string;
  Icon: LucideIcon;
  modalKey: T;
}

const AddButton = <T extends string | null>({
  label,
  Icon,
  modalKey,
}: AddButtonProps<T>) => {
  const dispatch = useAppDispatch();

  return (
    <button
      type="button"
      onClick={() => dispatch(openModal(modalKey))}
      className="bg-primary text-sm text-white ring-1 ring-primary w-fit rounded-lg h-10 font-semibold hover:cursor-pointer hover:bg-primary-hover transition-all duration-200"
    >
      <div className="flex gap-2 justify-center items-center px-4">
        <Icon className="w-4 h-4" />
        <p>{label}</p>
      </div>
    </button>
  );
};

export default AddButton;
