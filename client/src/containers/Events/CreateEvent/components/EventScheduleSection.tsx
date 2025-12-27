import DatePicker from "../../../../components/common/DatePicker";
import Dropdown from "../../../../components/common/Dropdown";
import { timeSlots } from "../../../../config/TIMES";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useRef, useEffect } from "react";
import type { CreateEventInputs } from "../CreateEvent";

const EventScheduleSection: React.FC = () => {
  const [openDropDown, setOpenDropDown] = useState<string | null>(null);
  const deliveryTimeRef = useRef<HTMLDivElement>(null);
  const pickUpTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openDropDown &&
        !deliveryTimeRef.current?.contains(e.target as Node) &&
        !pickUpTimeRef.current?.contains(e.target as Node)
      ) {
        setOpenDropDown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropDown]);

  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateEventInputs>();

  const deliveryDate = watch("deliveryDate");
  const deliveryTime = watch("deliveryTime");
  const pickUpDate = watch("pickUpDate");
  const pickUpTime = watch("pickUpTime");

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
              error={errors.deliveryTime?.message?.toString()}
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
              error={errors.pickUpTime?.message?.toString()}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventScheduleSection;
