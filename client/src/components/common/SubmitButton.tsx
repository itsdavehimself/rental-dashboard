import LoadingSpinner from "./LoadingSpinner";

interface SubmitButtonProps {
  label: string;
  disabled?: boolean;
  full?: boolean;
  loading?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  label,
  disabled = false,
  full = true,
  loading = false,
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`
        ${full ? "w-full" : "w-fit"}
        px-8 h-10 rounded-lg text-sm font-semibold ring-1 text-white
        transition-all duration-200 flex justify-center items-center
        ${
          disabled
            ? "bg-gray-400 ring-gray-400 cursor-not-allowed"
            : "bg-primary ring-primary hover:bg-primary-hover"
        }
        ${loading ? "pointer-events-none" : "cursor-pointer"}
      `}
    >
      {loading ? <LoadingSpinner dimensions={{ x: 4, y: 4 }} /> : label}
    </button>
  );
};

export default SubmitButton;
