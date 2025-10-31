import DatePicker from "../../../../components/common/DatePicker";
import Dropdown from "../../../../components/common/Dropdown";
import { timeSlots } from "../../../../config/TIMES";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { type UseFormSetValue, type FieldErrors } from "react-hook-form";
import { type CreateEventInputs } from "../CreateEvent";
import { useRef } from "react";

interface EventScheduleSectionProps {
  deliveryDate: Date;
  deliveryTime: string;
  pickUpDate: Date;
  pickUpTime: string;
  setValue: UseFormSetValue<CreateEventInputs>;
  formErrors: FieldErrors<CreateEventInputs>;
}

const EventScheduleSection: React.FC<EventScheduleSectionProps> = ({
  deliveryDate,
  deliveryTime,
  pickUpDate,
  pickUpTime,
  setValue,
  formErrors,
}) => {
  const [openDropDown, setOpenDropDown] = useState<string | null>(null);
  const deliveryTimeRef = useRef<HTMLDivElement>(null);
  const pickUpTimeRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="flex flex-col gap-4 border-1 border-gray-200 rounded-lg py-4 px-6">
        <h4 className="font-semibold text-lg">Scheduling</h4>
        <div className="grid grid-cols-[1fr_6rem_1fr] items-center">
          <div className="grid grid-cols-[2fr_0.75fr] gap-4 items-center">
            <DatePicker
              label="Delivery Date"
              date={deliveryDate}
              disablePastDates={true}
              onSelect={(val) => setValue("deliveryDate", val)}
            />
            <Dropdown
              ref={deliveryTimeRef}
              label="Delivery Time"
              openDropdown={openDropDown}
              setOpenDropdown={setOpenDropDown}
              selectedLabel={
                timeSlots().find((t) => t.value === deliveryTime)?.label ??
                "Select a time"
              }
              options={timeSlots()}
              value={deliveryTime}
              onChange={(val) => setValue("deliveryTime", val as string)}
              error={formErrors.deliveryTime?.message}
            />
          </div>
          <div className="flex justify-center mt-5">
            <ArrowRight />
          </div>
          <div className="grid grid-cols-[2fr_0.75fr] gap-4 items-center">
            <DatePicker
              label="Pickup Date"
              date={pickUpDate}
              onSelect={(val) => setValue("pickUpDate", val)}
              disablePastDates={true}
              deliveryDate={deliveryDate}
            />
            <Dropdown
              ref={pickUpTimeRef}
              label="Pickup Time"
              openDropdown={openDropDown}
              setOpenDropdown={setOpenDropDown}
              selectedLabel={
                timeSlots().find((t) => t.value === pickUpTime)?.label ??
                "Select a time"
              }
              options={timeSlots()}
              value={pickUpTime}
              onChange={(val) => setValue("pickUpTime", val as string)}
              error={formErrors.pickUpTime?.message}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventScheduleSection;
