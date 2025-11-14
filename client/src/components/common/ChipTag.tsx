import TAG_COLOR_MAP from "../../config/TAG_COLOR_MAP";

interface ChipTagProps {
  label: string;
  color: keyof typeof TAG_COLOR_MAP;
}

const ChipTag: React.FC<ChipTagProps> = ({ label, color }) => {
  const styles = TAG_COLOR_MAP[color];

  return (
    <div className={`${styles.bg} w-fit py-1 px-2 rounded-xl`}>
      <p className={`text-xs font-semibold ${styles.text}`}>{label}</p>
    </div>
  );
};

export default ChipTag;
