interface SelectButtonProps {
  onClick: (e) => void;
}

const SelectButton: React.FC<SelectButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-primary text-xs text-white ring-1 ring-primary w-fit rounded-lg h-6 font-semibold hover:cursor-pointer hover:bg-primary-hover transition-all duration-200"
    >
      <div className="flex gap-2 justify-center items-center px-3">
        <p>Select</p>
      </div>
    </button>
  );
};

export default SelectButton;
