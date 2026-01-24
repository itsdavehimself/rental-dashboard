import DatePicker from "../../../../components/common/DatePicker";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useRef, useEffect } from "react";
import type { CreateEventInputs } from "../CreateEvent";
import StyledInput from "../../../../components/common/StyledInput";
import normalizeTime from "../../../../helpers/normalizeTime";

const EventScheduleSection: React.FC = () => {
  const [openDropDown, setOpenDropDown] = useState<string | null>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openDropDown &&
        !startTimeRef.current?.contains(e.target as Node) &&
        !endTimeRef.current?.contains(e.target as Node)
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
    register,
    formState: { errors },
  } = useFormContext<CreateEventInputs>();

  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const handleTimeBlur =
    (fieldName: keyof CreateEventInputs) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      if (!rawValue) return;

      const normalized = normalizeTime(rawValue);

      if (normalized.wasParsed) {
        setValue(fieldName, normalized.text, { shouldValidate: true });
      } else {
        e.target.value = "";
        setValue(fieldName, "" as any, { shouldValidate: true });
      }
    };

  return (
    <>
      <div className="flex flex-col gap-4 border-1 border-gray-200 rounded-lg py-4 px-6">
        <h4 className="font-semibold text-lg">Scheduling</h4>
        <div className="grid grid-cols-[1fr_6rem_1fr] items-center">
          <div className="grid grid-cols-[2fr_90px] gap-4 items-center w-full">
            <DatePicker
              label="Delivery Date"
              date={startDate}
              disablePastDates={true}
              onSelect={(val) => setValue("startDate", val)}
            />
            <StyledInput
              label="Start Time"
              placeholder="2:00pm"
              error={errors.startTime?.message}
              register={register("startTime", {
                onBlur: handleTimeBlur("startTime"),
              })}
            />
          </div>
          <div className="justify-center mt-5 3xl:flex">
            <ArrowRight />
          </div>
          <div className="grid grid-cols-[2fr_90px] gap-4 items-center w-full">
            <DatePicker
              label="Pickup Date"
              date={endDate}
              onSelect={(val) => setValue("endDate", val)}
              disablePastDates={true}
              startDate={startDate}
            />
            <StyledInput
              label="End Time"
              placeholder="3:00pm"
              error={errors.endTime?.message}
              register={register("endTime", {
                onBlur: handleTimeBlur("endTime"),
              })}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventScheduleSection;
