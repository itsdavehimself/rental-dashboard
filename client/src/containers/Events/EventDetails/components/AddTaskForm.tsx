import { useForm, type SubmitHandler } from "react-hook-form";
import DatePicker from "../../../../components/common/DatePicker";
import Dropdown from "../../../../components/common/Dropdown";
import React, { useMemo, useEffect, useRef, useState } from "react";
import {
  createLogistics,
  getActiveTrucks,
  updateLogistics,
} from "../../services/logisticsService";
import type { Truck } from "../../types/Logistics";
import { useEventDetails } from "../../hooks/useEventDetails";
import { useUsers } from "../../../Team/hooks/useUsers";
import SubmitButton from "../../../../components/common/SubmitButton";
import MultiCrewDropdown from "../../../../components/common/MultiCrewDropdown";
import { useToast } from "../../../../hooks/useToast";
import StyledInput from "../../../../components/common/StyledInput";
import normalizeTime from "../../../../helpers/normalizeTime";
import formatToUTC from "../../../../helpers/formatToUTC";
import type { CrewPreset } from "../../types/CrewPreset";
import type { CrewMember, LogisticsTrip } from "../../types/Event";
import { format } from "date-fns";
import { useAppDispatch } from "../../../../app/hooks";
import { closeModal } from "../../../../app/slices/uiSlice";
import TruckSchedule from "./TruckSchedule";

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface AddTaskFormProps {
  taskType: string | null;
  crewPresets: CrewPreset[];
  taskDetails?: LogisticsTrip | null;
}

export type TaskInputs = {
  taskStartDate: Date;
  taskStartTime: string;
  taskEndDate: Date;
  taskEndTime: string;
  truck: string;
  lead: string;
  crew: (string | number)[];
};

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  taskType,
  crewPresets,
  taskDetails,
}) => {
  const {
    handleSubmit,
    watch,
    setValue,
    register,
    reset,
    formState: { errors },
  } = useForm<TaskInputs>({
    defaultValues: {
      taskStartDate: new Date(),
      crew: [],
    },
  });

  const { fetchedEvent, addLogisticsTrip, fetchEvent } = useEventDetails();
  const { users } = useUsers("active");
  const [openDropDown, setOpenDropDown] = useState<string | null>(null);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>();

  const dispatch = useAppDispatch();

  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);
  const truckRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const crewRef = useRef<HTMLDivElement>(null);

  const taskStartDate = watch("taskStartDate");
  const truck = watch("truck");
  const lead = watch("lead");
  const crew = watch("crew");

  const { addToast } = useToast();

  const onSubmit: SubmitHandler<TaskInputs> = async (data) => {
    if (fetchedEvent && (taskType || taskDetails)) {
      const startUtc = formatToUTC(data.taskStartDate, data.taskStartTime);
      const endUtc = formatToUTC(data.taskStartDate, data.taskEndTime);

      if (!startUtc || !endUtc) {
        addToast("Error", "Please enter valid start and end times");
        return;
      }

      try {
        // setErrors(null);
        if (taskDetails) {
          await updateLogistics(
            apiUrl,
            taskDetails.uid,
            data,
            startUtc,
            endUtc,
          );
          addToast("Success", "Trip updated successfully.");
          fetchEvent();
        } else {
          await createLogistics(
            apiUrl,
            fetchedEvent?.uid,
            data,
            startUtc,
            endUtc,
            taskType!,
          );
          addToast("Success", `Trip successfully added.`);
          fetchEvent();
        }

        dispatch(closeModal());
      } catch (err) {
        // handleError(err, setErrors);
      }
    }
  };

  const fetchActiveTrucks = async () => {
    try {
      const trucks = await getActiveTrucks(apiUrl);
      setTrucks(trucks);
    } catch (err) {
      console.error("Error fetching active trucks:", err);
    }
  };

  useEffect(() => {
    fetchActiveTrucks();
    if (taskDetails && users.length > 0) {
      const start = new Date(taskDetails.scheduledStart);
      const end = new Date(taskDetails.scheduledEnd);

      const lead = users.find(
        (u) => `${u.firstName} ${u.lastName}` === taskDetails.crewLeadName,
      );

      reset({
        taskStartDate: start,
        taskEndDate: end,
        taskStartTime: format(start, "h:mma").toLowerCase(),
        taskEndTime: format(end, "h:mma").toLowerCase(),
        truck: taskDetails.truckUid,
        lead: lead ? lead.uid : "",
        crew: taskDetails.crew
          ? taskDetails.crew.map((c: CrewMember) => c.userUid)
          : [],
      });

      return;
    }

    if (fetchedEvent && taskType) {
      const isStartType = ["Delivery/Setup", "Delivery", "Setup"].includes(
        taskType,
      );
      const isEndType = ["Teardown/Pickup", "Teardown", "Pickup"].includes(
        taskType,
      );
      const targetDateString = isStartType
        ? fetchedEvent.eventStart
        : isEndType
          ? fetchedEvent.eventEnd
          : null;
      const defaultDate = targetDateString
        ? new Date(targetDateString)
        : new Date();
      setValue("taskStartDate", defaultDate);
    }
  }, [fetchedEvent, setValue, taskType, users, reset, taskDetails]);

  const activeTruckOptions = useMemo(() => {
    return trucks
      .filter((t) => t.isActive)
      .map((t) => ({ value: t.uid, label: t.name }));
  }, [trucks]);

  const userOptions = useMemo(() => {
    return users.map((u) => ({
      value: u.uid,
      label: `${u.firstName} ${u.lastName}`,
    }));
  }, [users]);

  const filteredCrewOptions = useMemo(() => {
    return userOptions.filter((u) => u.value !== lead);
  }, [userOptions, lead]);

  useEffect(() => {
    if (lead && crew.includes(lead)) {
      setValue(
        "crew",
        crew.filter((id) => id !== lead),
      );
    }
  }, [lead, crew, setValue]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        openDropDown &&
        !startTimeRef.current?.contains(e.target as Node) &&
        !endTimeRef.current?.contains(e.target as Node) &&
        !truckRef.current?.contains(e.target as Node) &&
        !leadRef.current?.contains(e.target as Node) &&
        !crewRef.current?.contains(e.target as Node)
      ) {
        setOpenDropDown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropDown]);

  const handlePresetClick = (presetUid: string) => {
    const preset = crewPresets.find((c) => c.uid === presetUid);
    setSelectedPreset(presetUid);
    if (preset) {
      setValue("truck", preset?.truckUid);
      setValue("lead", preset.leadUid);
      const crew = preset.crew.filter((c) => c !== preset.leadUid);
      setValue("crew", crew);
    }
  };

  const handleTimeBlur =
    (fieldName: keyof TaskInputs) =>
    (e: React.FocusEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      if (!rawValue) return;

      const normalized = normalizeTime(rawValue);

      if (!normalized.wasParsed) {
        e.target.value = "";
        setValue(fieldName, "" as any, { shouldValidate: true });
        return;
      }

      setValue(fieldName, normalized.text, { shouldValidate: true });

      if (fieldName !== "taskStartTime") return;

      const [time, meridiem] = normalized.text.split(/(am|pm)/);
      const [h, m = "0"] = time.split(":");

      let hours = Number(h);
      const minutes = Number(m);

      if (meridiem === "pm" && hours < 12) hours += 12;
      if (meridiem === "am" && hours === 12) hours = 0;

      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      d.setMinutes(d.getMinutes() + 60);

      const endHours = d.getHours();
      const endMinutes = d.getMinutes().toString().padStart(2, "0");
      const endMeridiem = endHours >= 12 ? "pm" : "am";
      const displayHours = endHours % 12 || 12;

      setValue("taskEndTime", `${displayHours}:${endMinutes}${endMeridiem}`, {
        shouldValidate: true,
      });
    };

  return (
    <section className="grid grid-cols-[1.5fr_1fr]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center px-8 pt-4 gap-4"
      >
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <h4 className="font-semibold">Crew Presets</h4>
          </div>
          <div>
            {crewPresets.map((c) => (
              <button
                type="button"
                key={c.uid}
                onClick={() => handlePresetClick(c.uid)}
                className={`${
                  selectedPreset === c.uid
                    ? "bg-sky-100 text-sky-700 border-sky-700"
                    : "bg-white text-gray-500 border-gray-500 hover:border-sky-700 hover:text-sky-700 hover:bg-sky-100"
                } border-1 font-semibold py-1 px-2 rounded-md text-sm hover:cursor-pointer transition-all duration-200`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <Dropdown
          ref={truckRef}
          label="Select a Truck"
          openDropdown={openDropDown}
          setOpenDropdown={setOpenDropDown}
          selectedLabel={
            activeTruckOptions.find((t) => t.value === truck)?.label ??
            "Select a truck"
          }
          options={activeTruckOptions}
          value={truck}
          onChange={(val) => setValue("truck", val as string)}
          error={errors.truck?.message}
        />

        <DatePicker
          label="Start Date"
          date={taskStartDate}
          disablePastDates={true}
          onSelect={(val) => setValue("taskStartDate", val)}
        />

        <div className="grid grid-cols-2 gap-4 items-center">
          <StyledInput
            label="Start Time"
            placeholder="2:00pm"
            error={errors.taskStartTime?.message}
            register={register("taskStartTime", {
              onBlur: handleTimeBlur("taskStartTime"),
            })}
          />
          <StyledInput
            label="End Time"
            placeholder="3:00pm"
            error={errors.taskEndTime?.message}
            register={register("taskEndTime", {
              onBlur: handleTimeBlur("taskEndTime"),
            })}
          />
        </div>

        <Dropdown
          ref={leadRef}
          label="Select Lead"
          openDropdown={openDropDown}
          setOpenDropdown={setOpenDropDown}
          selectedLabel={
            userOptions.find((u) => u.value === lead)?.label ?? "Select Lead"
          }
          options={userOptions}
          value={lead}
          onChange={(val) => setValue("lead", val as string)}
          error={errors.lead?.message}
        />

        <MultiCrewDropdown
          ref={crewRef}
          label="Select Crew Member"
          openDropdown={openDropDown}
          setOpenDropdown={setOpenDropDown}
          options={filteredCrewOptions}
          selectedValues={crew}
          onChange={(vals) => setValue("crew", vals)}
          error={errors.crew?.message}
        />

        <div className="self-center w-1/2 mt-2">
          <SubmitButton label="Save Crew" />
        </div>
      </form>

      <TruckSchedule
        truck={truck}
        trucks={trucks}
        taskStartDate={taskStartDate}
        eventUid={fetchedEvent?.uid ? fetchedEvent.uid : null}
      />
    </section>
  );
};

export default AddTaskForm;
