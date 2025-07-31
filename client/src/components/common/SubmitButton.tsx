interface SubmitButtonProps {
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label }) => {
  return (
    <button
      type="submit"
      className="bg-primary text-white ring-1 ring-primary w-full rounded-lg h-10 font-semibold hover:cursor-pointer hover:bg-primary-hover transition-all duration-200"
    >
      {label}
    </button>
  );
};

export default SubmitButton;
