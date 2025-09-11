import DatePicker from "../../../../components/common/DatePicker";
import Dropdown from "../../../../components/common/Dropdown";
import { timeSlots } from "../../../../config/TIMES";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface EventScheduleSectionProps {}

const EventScheduleSection: React.FC<EventScheduleSectionProps> = ({}) => {
  const [openDropDown, setOpenDropDown] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-col gap-4 border-1 border-gray-200 rounded-lg py-4 px-6">
        <h4 className="font-semibold text-lg">Scheduling</h4>
        <div className="grid grid-cols-[1fr_6rem_1fr] items-center">
          <div className="grid grid-cols-[2fr_0.75fr] gap-4 items-center">
            <DatePicker label="Delivery Date" />
            <Dropdown
              label="Delivery Time"
              openDropdown={openDropDown}
              setOpenDropdown={setOpenDropDown}
              options={timeSlots()}
            />
          </div>
          <div className="flex justify-center mt-5">
            <ArrowRight />
          </div>
          <div className="grid grid-cols-[2fr_0.75fr] gap-4 items-center">
            <DatePicker label="Pickup Date" />
            <Dropdown
              label="Pickup Time"
              openDropdown={openDropDown}
              setOpenDropdown={setOpenDropDown}
              options={timeSlots()}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventScheduleSection;
