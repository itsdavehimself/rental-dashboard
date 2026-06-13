import { useEffect, useMemo, useRef, useState, type FocusEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import DatePicker from "../../../components/common/DatePicker";
import StyledInput from "../../../components/common/StyledInput";
import SubmitButton from "../../../components/common/SubmitButton";
import Dropdown from "../../../components/common/Dropdown";
import MultiCrewDropdown from "../../../components/common/MultiCrewDropdown";
import ActionButton from "../../../components/common/ActionButton";
import { getActiveTrucks } from "../../Events/services/logisticsService";
import { useUsers } from "../../Team/hooks/useUsers";
import type { Truck } from "../../Events/types/Logistics";
import formatToUTC from "../../../helpers/formatToUTC";
import { useToast } from "../../../hooks/useToast";
import normalizeTime from "../../../helpers/normalizeTime";
import {
  createManifestTrip,
  updateManifestTrip,
  type CreateManifestTripRequest,
} from "./services/logisticsService";
import { fetchEvents } from "../../Events/services/eventService";
import type { DispatchRun } from "./RunCard";

const apiUrl = import.meta.env.VITE_API_BASE_URL;
import { useAppDispatch } from "../../../app/hooks";
import { closeModal } from "../../../app/slices/uiSlice";

type NewRunInputs = {
  runName: string;
  runDate: Date;
  startTime: string;
  endTime: string;
  truck: string;
  lead: string;
  crew: (string | number)[];
};

type WarehouseWorkType =
  | "WarehouseLoad"
  | "WarehouseReload"
  | "WarehouseUnload"
  | "ReturnToWarehouse";

type EventWorkType = "Delivery" | "Setup" | "Teardown" | "Pickup";

type ManifestWorkType = WarehouseWorkType | EventWorkType;

type ManifestItemDraft = {
  id: string;
  workItemUid?: string | null;
  sortOrder: number;
  type: ManifestWorkType;
  eventUid?: string;
  eventName?: string;
  location?: string;
};

type EventOption = {
  uid: string;
  eventName: string;
  clientName: string;
  location: string;
  status: string;
};

interface NewRunFormProps {
  mode?: "create" | "edit";
  initialRun?: DispatchRun | null;
  onRunCreated?: (run: any) => void;
  onRunUpdated?: (run: any) => void;
}

const NewRunForm: React.FC<NewRunFormProps> = ({
  mode = "create",
  initialRun,
  onRunCreated,
  onRunUpdated,
}) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<NewRunInputs>({
    defaultValues: {
      runDate: new Date(),
      crew: [],
    },
  });

  const { users } = useUsers("active");
  const { addToast } = useToast();
  const dispatch = useAppDispatch();

  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [manifestItems, setManifestItems] = useState<ManifestItemDraft[]>([]);
  const [selectedWarehouseTask, setSelectedWarehouseTask] =
    useState<WarehouseWorkType>("WarehouseLoad");
  const [selectedEventTask, setSelectedEventTask] =
    useState<EventWorkType>("Delivery");
  const [eventOptionsRaw, setEventOptionsRaw] = useState<EventOption[]>([]);
  const [selectedEventUid, setSelectedEventUid] = useState<string>("");
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);

  const truckRef = useRef<HTMLDivElement>(null);
  const leadRef = useRef<HTMLDivElement>(null);
  const crewRef = useRef<HTMLDivElement>(null);
  const warehouseTaskRef = useRef<HTMLDivElement>(null);
  const eventTaskRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  const runDate = watch("runDate");
  const truck = watch("truck");
  const lead = watch("lead");
  const crew = watch("crew");

  const warehouseTaskOptions: {
    value: WarehouseWorkType;
    label: string;
  }[] = [
    { value: "WarehouseLoad", label: "Warehouse Load" },
    { value: "WarehouseReload", label: "Warehouse Reload" },
    { value: "WarehouseUnload", label: "Warehouse Unload" },
    { value: "ReturnToWarehouse", label: "Return to Warehouse" },
  ];

  const eventTaskOptions: {
    value: EventWorkType;
    label: string;
  }[] = [
    { value: "Delivery", label: "Delivery" },
    { value: "Setup", label: "Setup" },
    { value: "Teardown", label: "Teardown" },
    { value: "Pickup", label: "Pickup" },
  ];

  const eventOptions = eventOptionsRaw.map((event) => ({
    value: event.uid,
    label: `${event.eventName} - ${event.location}`,
  }));

  const formatManifestType = (type: ManifestWorkType) => {
    const allOptions = [...warehouseTaskOptions, ...eventTaskOptions];

    return allOptions.find((option) => option.value === type)?.label ?? type;
  };

  const resequenceManifestItems = (items: ManifestItemDraft[]) => {
    return items.map((item, index) => ({
      ...item,
      sortOrder: index + 1,
    }));
  };

  const addWarehouseTask = () => {
    setManifestItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sortOrder: prev.length + 1,
        type: selectedWarehouseTask,
      },
    ]);
  };

  const addEventTask = () => {
    const selectedEvent = eventOptionsRaw.find(
      (event) => event.uid === selectedEventUid,
    );

    if (!selectedEvent) {
      addToast("Error", "Please select an event.");
      return;
    }

    setManifestItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sortOrder: prev.length + 1,
        type: selectedEventTask,
        eventUid: selectedEvent.uid,
        eventName: selectedEvent.eventName,
        location: selectedEvent.location,
      },
    ]);
  };

  const removeManifestItem = (id: string) => {
    setManifestItems((prev) =>
      resequenceManifestItems(prev.filter((item) => item.id !== id)),
    );
  };

  const moveManifestItem = (id: string, direction: "up" | "down") => {
    setManifestItems((prev) => {
      const currentIndex = prev.findIndex((item) => item.id === id);

      if (currentIndex === -1) return prev;

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (targetIndex < 0 || targetIndex >= prev.length) return prev;

      const next = [...prev];
      const currentItem = next[currentIndex];

      next[currentIndex] = next[targetIndex];
      next[targetIndex] = currentItem;

      return resequenceManifestItems(next);
    });
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
    fetchEventOptions();
  }, []);

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
        openDropdown &&
        !truckRef.current?.contains(e.target as Node) &&
        !leadRef.current?.contains(e.target as Node) &&
        !crewRef.current?.contains(e.target as Node) &&
        !warehouseTaskRef.current?.contains(e.target as Node) &&
        !eventTaskRef.current?.contains(e.target as Node) &&
        !eventRef.current?.contains(e.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

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

  const onSubmit: SubmitHandler<NewRunInputs> = async (data) => {
    const scheduledStart = formatToUTC(data.runDate, data.startTime);
    const scheduledEnd = formatToUTC(data.runDate, data.endTime);

    if (!data.runName?.trim()) {
      addToast("Error", "Please enter a run name.");
      return;
    }

    if (!scheduledStart || !scheduledEnd) {
      addToast("Error", "Please enter valid start and end times.");
      return;
    }

    if (!data.truck) {
      addToast("Error", "Please select a truck.");
      return;
    }

    if (!data.lead) {
      addToast("Error", "Please select a lead.");
      return;
    }

    if (manifestItems.length === 0) {
      addToast("Error", "Please add at least one manifest item.");
      return;
    }

    const payload: CreateManifestTripRequest = {
      name: data.runName.trim(),
      truckUid: data.truck,
      crewLeadUid: data.lead,
      crewUids: data.crew.map(String),
      scheduledStart,
      scheduledEnd,
      internalNotes: null,
      workItems: manifestItems.map((item) => ({
        workItemUid: mode === "edit" ? (item.workItemUid ?? null) : null,
        sortOrder: item.sortOrder,
        type: item.type,
        eventUid: item.eventUid ?? null,
        specificNotes: null,
      })),
    };

    try {
      if (mode === "edit") {
        if (!initialRun?.id) {
          addToast("Error", "Missing run id.");
          return;
        }

        const updatedRun = await updateManifestTrip(
          apiUrl,
          initialRun.id,
          payload,
        );
        onRunUpdated?.(updatedRun);

        addToast("Success", "Truck run updated.");
        dispatch(closeModal());
        return;
      }

      const createdRun = await createManifestTrip(apiUrl, payload);
      onRunCreated?.(createdRun);

      addToast("Success", "Truck run created.");
      dispatch(closeModal());
    } catch (err) {
      if (err instanceof Error) {
        addToast("Error", err.message);
      } else {
        addToast("Error", "There was a problem creating the truck run.");
      }
    }
  };

  const handleTimeBlur =
    (fieldName: keyof NewRunInputs) => (e: FocusEvent<HTMLInputElement>) => {
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

  const fetchEventOptions = async () => {
    try {
      setIsLoadingEvents(true);

      const response = await fetchEvents(apiUrl, 1);

      const options = response.data
        .filter((event) => ["Confirmed", "Scheduled"].includes(event.status))
        .map((event) => ({
          uid: event.uid,
          eventName: event.eventName || "Unnamed Event",
          clientName:
            `${event.clientFirstName ?? ""} ${event.clientLastName ?? ""}`.trim(),
          location: `${event.deliveryCity}, ${event.deliveryState}`,
          status: event.status,
        }));

      setEventOptionsRaw(options);

      if (options.length > 0) {
        setSelectedEventUid(options[0].uid);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      addToast("Error", "There was a problem fetching events.");
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const formatTimeForInput = (value?: string) => {
    if (!value) return "";

    return new Date(value)
      .toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
      .toLowerCase()
      .replace(/\s/g, "");
  };

  useEffect(() => {
    if (mode !== "edit" || !initialRun) return;

    const start = initialRun.scheduledStartUtc
      ? new Date(initialRun.scheduledStartUtc)
      : new Date();

    reset({
      runName: initialRun.title,
      runDate: start,
      startTime: formatTimeForInput(initialRun.scheduledStartUtc),
      endTime: formatTimeForInput(initialRun.scheduledEndUtc),
      truck: initialRun.truckUid ?? "",
      lead: initialRun.crewLeadUid ?? "",
      crew: initialRun.crewUids ?? [],
    });

    setManifestItems(
      initialRun.items.map((item) => ({
        id: item.id,
        workItemUid: item.id,
        sortOrder: item.sortOrder,
        type: item.type,
        eventUid: item.eventUid ?? undefined,
        eventName: item.eventName,
        location: item.location,
      })),
    );
  }, [mode, initialRun, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col w-[min(92vw,1100px)] max-h-[78vh] overflow-hidden px-6 pt-4"
    >
      <div className="grid grid-cols-[360px_1fr] gap-6 min-h-0">
        <section className="flex flex-col gap-4 border-1 border-gray-200 rounded-lg p-4 h-fit">
          <div>
            <h4 className="font-semibold">Run Details</h4>
            <p className="text-xs text-gray-400">
              Truck, timing, and crew assignment.
            </p>
          </div>

          <StyledInput
            label="Run Name"
            placeholder="Morning Pickup Run"
            register={register("runName")}
            error={errors.runName?.message}
          />

          <DatePicker
            label="Run Date"
            date={runDate}
            onSelect={(val) => setValue("runDate", val)}
            disablePastDates={false}
          />

          <div className="grid grid-cols-2 gap-4">
            <StyledInput
              label="Start Time"
              placeholder="9:00am"
              register={register("startTime", {
                onBlur: handleTimeBlur("startTime"),
              })}
              error={errors.startTime?.message}
            />

            <StyledInput
              label="End Time"
              placeholder="12:00pm"
              register={register("endTime", {
                onBlur: handleTimeBlur("endTime"),
              })}
              error={errors.endTime?.message}
            />
          </div>

          <Dropdown
            ref={truckRef}
            label="Truck"
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            selectedLabel={
              activeTruckOptions.find((t) => t.value === truck)?.label ??
              "Select truck"
            }
            options={activeTruckOptions}
            value={truck}
            onChange={(val) => setValue("truck", val as string)}
            error={errors.truck?.message}
          />

          <Dropdown
            ref={leadRef}
            label="Lead"
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            selectedLabel={
              userOptions.find((u) => u.value === lead)?.label ?? "Select lead"
            }
            options={userOptions}
            value={lead}
            onChange={(val) => setValue("lead", val as string)}
            error={errors.lead?.message}
          />

          <MultiCrewDropdown
            ref={crewRef}
            label="Crew"
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            options={filteredCrewOptions}
            selectedValues={crew}
            onChange={(vals) => setValue("crew", vals)}
            error={errors.crew?.message}
          />
        </section>

        <section className="flex flex-col gap-4 border-1 border-gray-200 rounded-lg p-4 min-h-0 overflow-hidden">
          <div>
            <h4 className="font-semibold">Manifest</h4>
            <p className="text-xs text-gray-400">
              Build the ordered tasks this truck run should follow.
            </p>
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
            <Dropdown
              ref={warehouseTaskRef}
              label="Warehouse Task"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              selectedLabel={formatManifestType(selectedWarehouseTask)}
              options={warehouseTaskOptions}
              value={selectedWarehouseTask}
              onChange={(val) =>
                setSelectedWarehouseTask(val as WarehouseWorkType)
              }
            />

            <div className="pb-0.5">
              <ActionButton
                label="Add"
                icon={Plus}
                style="outline"
                onClick={addWarehouseTask}
              />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_160px_auto] gap-3 items-end">
            <Dropdown
              ref={eventRef}
              label="Event"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              selectedLabel={
                isLoadingEvents
                  ? "Loading events..."
                  : (eventOptions.find(
                      (event) => event.value === selectedEventUid,
                    )?.label ?? "Select event")
              }
              options={eventOptions}
              value={selectedEventUid}
              onChange={(val) => setSelectedEventUid(val as string)}
            />

            <Dropdown
              ref={eventTaskRef}
              label="Event Task"
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              selectedLabel={formatManifestType(selectedEventTask)}
              options={eventTaskOptions}
              value={selectedEventTask}
              onChange={(val) => setSelectedEventTask(val as EventWorkType)}
            />

            <div className="pb-0.5">
              <ActionButton
                label="Add"
                icon={Plus}
                style="outline"
                onClick={addEventTask}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 min-h-0 overflow-y-auto pr-1">
            {manifestItems.length === 0 ? (
              <div className="rounded-lg border-1 border-dashed border-gray-300 p-4 text-sm text-gray-400 text-center">
                No manifest items yet. Add a warehouse or event task to start
                building the run.
              </div>
            ) : (
              manifestItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[2rem_1fr_auto] gap-3 items-center rounded-lg bg-gray-50 border-1 border-gray-200 p-3"
                >
                  <div className="flex justify-center items-center h-8 w-8 rounded-full bg-white border-1 border-gray-200 text-sm font-semibold">
                    {item.sortOrder}
                  </div>

                  <div className="flex flex-col">
                    <p className="font-semibold text-sm">
                      {formatManifestType(item.type)}
                    </p>

                    {item.eventName ? (
                      <>
                        <p className="text-xs text-gray-500">
                          {item.eventName}
                        </p>
                        <p className="text-xs text-gray-400">{item.location}</p>
                      </>
                    ) : (
                      <p className="text-xs text-gray-400">Warehouse task</p>
                    )}
                  </div>

                  <div className="flex gap-2 items-center">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveManifestItem(item.id, "up")}
                      className={`transition-colors duration-200 ${
                        index === 0
                          ? "text-gray-300 cursor-default"
                          : "text-gray-500 hover:text-primary hover:cursor-pointer"
                      }`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      disabled={index === manifestItems.length - 1}
                      onClick={() => moveManifestItem(item.id, "down")}
                      className={`transition-colors duration-200 ${
                        index === manifestItems.length - 1
                          ? "text-gray-300 cursor-default"
                          : "text-gray-500 hover:text-primary hover:cursor-pointer"
                      }`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeManifestItem(item.id)}
                      className="text-gray-500 hover:text-primary hover:cursor-pointer transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-4 pb-2">
        <div className="w-40">
          <SubmitButton
            label={mode === "edit" ? "Save Run" : "Create Run"}
          />{" "}
        </div>
      </div>
    </form>
  );
};

export default NewRunForm;
