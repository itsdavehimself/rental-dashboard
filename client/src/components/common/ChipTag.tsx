interface ChipTagProps {
  label: string;
  color: string;
}

const ChipTag: React.FC<ChipTagProps> = ({ label, color }) => {
  return (
    <div className={`bg-${color}-200 w-fit py-1 px-2 rounded-xl`}>
      <p className={`text-xs font-semibold text-${color}-800`}>{label}</p>
    </div>
  );
};

export default ChipTag;
