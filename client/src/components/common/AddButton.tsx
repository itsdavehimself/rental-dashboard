import type { LucideIcon } from "lucide-react";

interface AddButtonProps<T extends string | null> {
  label: string;
  Icon: LucideIcon;
  addModalOpen: React.Dispatch<React.SetStateAction<T>>;
  modalKey: T;
}

const AddButton = <T extends string | null>({
  label,
  Icon,
  addModalOpen,
  modalKey,
}: AddButtonProps<T>) => {
  return (
    <button
      type="button"
      onClick={() => addModalOpen(modalKey)}
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
