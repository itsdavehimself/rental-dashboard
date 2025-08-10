import { Calendar } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

interface DatePickerProps {
  label: string;
  date: Date;
  onSelect: (val: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, date, onSelect }) => {
  const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);

  const defaultClassNames = getDefaultClassNames();

  useEffect(() => {
    setOpenDatePicker(false);
  }, [date]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDatePicker && !ref.current?.contains(event.target as Node)) {
        setOpenDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDatePicker]);

  return (
    <div ref={ref} className="flex flex-col gap-1 relative">
      <label className="text-sm font-semibold">{label}</label>

      <div className="relative">
        <div
          onClick={() => setOpenDatePicker(!openDatePicker)}
          className="flex items-center text-sm ring-1 w-full rounded-lg h-10 pl-2 gap-2 transition-all duration-200 ring-gray-200 hover:cursor-pointer hover:ring-black focus:ring-primary focus:outline-0"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpenDatePicker(true);
            }
            if (e.key === "Escape") {
              setOpenDatePicker(false);
            }
          }}
        >
          <Calendar className="h-5 w-5" />
          <div>{date ? format(date, "MM/dd/yyyy") : "Select a date"}</div>
        </div>

        {openDatePicker && (
          <div className="absolute flex justify-center left-0 top-full z-50 mt-1 bg-white shadow-md rounded-xl ring-1 ring-gray-200 w-full">
            <DayPicker
              animate
              mode="single"
              selected={date}
              onSelect={onSelect}
              captionLayout="dropdown"
              classNames={{
                selected: `flex justify-center item-center bg-primary text-white rounded-3xl font-semibold`,
                root: `${defaultClassNames.root} shadow-lg p-5 w-full flex justify-center focus:outline-1 focus:outline-primary`,
                chevron: `fill-primary hover:cursor-pointer`,
                today: `${date || !date ? "text-primary" : "text-white"}`,
                dropdowns: `flex text-md font-normal hover:cursor-pointer gap-x-2`,
                months_dropdown: "bg-white text-sm",
                years_dropdown: "bg-white text-sm",
                button_next:
                  "focus:outline-primary focus:outline-2 rounded-md p-1",
                button_previous:
                  "focus:outline-primary focus:outline-2 rounded-md p-1",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
