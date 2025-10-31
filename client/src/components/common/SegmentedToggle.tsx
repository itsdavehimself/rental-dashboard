import type React from "react";

type SegmentedToggleProps<T> = {
  setOption: React.Dispatch<React.SetStateAction<T>>;
  option: T;
  options: T[];
  labels: string[];
};

const SegmentedToggle = <T extends string | number>({
  option,
  options,
  setOption,
  labels,
}: SegmentedToggleProps<T>) => {
  return (
    <div className="grid grid-cols-2 text-sm w-2/3">
      <button
        type="button"
        onClick={() => setOption(options[0])}
        className={`p-2 border-t border-b border-l rounded-l-lg border-primary ${
          option === options[0]
            ? "bg-primary text-white font-semibold"
            : "bg-white hover:cursor-pointer hover:bg-gray-50 transition-all duration-200"
        }`}
      >
        {labels[0]}
      </button>
      <button
        type="button"
        onClick={() => setOption(options[1])}
        className={`p-2 border-t border-b border-r rounded-r-lg border-primary ${
          option === options[1]
            ? "bg-primary text-white font-semibold"
            : "bg-white hover:cursor-pointer hover:bg-gray-50 transition-all duration-200"
        }`}
      >
        {labels[1]}
      </button>
    </div>
  );
};

export default SegmentedToggle;
