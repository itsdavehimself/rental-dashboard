import { useEffect, useMemo, useRef, useState, type FocusEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { GripVertical, Plus, Trash2 } from "lucide-react";
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
} from "../services/logisticsService";
import { fetchEvents } from "../../Events/services/eventService";
import type { DispatchRun } from "./RunCard";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

export type EventWorkType = "Delivery" | "Setup" | "Teardown" | "Pickup";

type ManifestWorkType = WarehouseWorkType | EventWorkType;

export type PrefillManifestItem = {
  type: EventWorkType;
  eventUid: string;
  eventName: string;
  location: string;
  eventStart?: string | null;
  eventEnd?: string | null;
};

type ManifestItemDraft = {
  id: string;
  workItemUid?: string;
  sortOrder: number;
  type: ManifestWorkType;
  eventUid?: string;
  eventName?: string;
  location?: string;
  eventStart?: string | null;
  eventEnd?: string | null;
};

type EventOption = {
  uid: string;
  eventName: string;
  clientName: string;
  location: string;
  status: string;
  eventStart: string;
  eventEnd: string;
};

interface NewRunFormProps {
  mode?: "create" | "edit";
  initialRun?: DispatchRun;
  onRunCreated?: (run: any) => void;
  onRunUpdated?: (run: any) => void;
  initialRunDate?: Date;
  initialManifestItems?: PrefillManifestItem[];
}

type SortableManifestItemProps = {
  item: ManifestItemDraft;
  formatManifestType: (type: ManifestWorkType) => string;
  formatEventWindow: (
    eventStart?: string | null,
    eventEnd?: string | null,
  ) => string | null;
  getTaskTimingHint: (item: ManifestItemDraft) => string | null;
  removeManifestItem: (id: string) => void;
};

const SortableManifestItem: React.FC<SortableManifestItemProps> = ({
  item,
  formatManifestType,
  formatEventWindow,
  getTaskTimingHint,
  removeManifestItem,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid grid-cols-[2rem_1fr_auto] gap-3 items-center rounded-lg border-1 border-gray-200 p-3 transition-shadow ${
        isDragging ? "bg-white shadow-lg z-10" : "bg-gray-50"
      }`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="flex justify-center items-center h-8 w-8 text-gray-400 hover:text-primary hover:cursor-grab active:cursor-grabbing transition-colors"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex flex-col">
        <div className="flex gap-2 items-center">
          <p className="font-semibold text-sm">
            {formatManifestType(item.type)}
          </p>

          <span className="text-[11px] text-gray-400">#{item.sortOrder}</span>
        </div>

        {item.eventName ? (
          <>
            <p className="text-xs text-gray-500">{item.eventName}</p>
            <p className="text-xs text-gray-400">{item.location}</p>

            {formatEventWindow(item.eventStart, item.eventEnd) && (
              <p className="text-xs font-semibold text-gray-500">
                {formatEventWindow(item.eventStart, item.eventEnd)}
              </p>
            )}

            {getTaskTimingHint(item) && (
              <p className="text-[11px] text-gray-400">
                {getTaskTimingHint(item)}
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-400">Warehouse task</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => removeManifestItem(item.id)}
        className="text-gray-500 hover:text-primary hover:cursor-pointer transition-colors duration-200"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

const NewRunForm: React.FC<NewRunFormProps> = ({
  mode = "create",
  initialRun,
  onRunCreated,
  onRunUpdated,
  initialRunDate,
  initialManifestItems = [],
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
      runDate: initialRunDate ?? new Date(),
      crew: [],
    },
  });

  const { users } = useUsers("active");
  const { addToast } = useToast();
  const dispatch = useAppDispatch();

  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [manifestItems, setManifestItems] = useState<ManifestItemDraft[]>(() =>
    initialManifestItems.map((item, index) => ({
      id: crypto.randomUUID(),
      sortOrder: index + 1,
      type: item.type,
      eventUid: item.eventUid,
      eventName: item.eventName,
      location: item.location,
      eventStart: item.eventStart,
      eventEnd: item.eventEnd,
    })),
  );
  const [selectedWarehouseTask, setSelectedWarehouseTask] =
    useState<WarehouseWorkType>("WarehouseLoad");
  const [selectedEventTask, setSelectedEventTask] =
    useState<EventWorkType>("Delivery");
  const [eventOptionsRaw, setEventOptionsRaw] = useState<EventOption[]>([]);
  const [selectedEventUid, setSelectedEventUid] = useState<string>("");
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  const formatEventDate = (value?: string | null) => {
    if (!value) return "";

    return new Date(value).toLocaleDateString([], {
      month: "long",
      day: "numeric",
    });
  };

  const formatEventTime = (value?: string | null) => {
    if (!value) return "";

    return new Date(value).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isSameLocalDate = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const formatEventWindow = (
    eventStart?: string | null,
    eventEnd?: string | null,
  ) => {
    if (!eventStart || !eventEnd) return null;

    const start = new Date(eventStart);
    const end = new Date(eventEnd);

    if (isSameLocalDate(start, end)) {
      return `${formatEventDate(eventStart)}, ${formatEventTime(
        eventStart,
      )} - ${formatEventTime(eventEnd)}`;
    }

    return `${formatEventDate(eventStart)}, ${formatEventTime(
      eventStart,
    )} - ${formatEventDate(eventEnd)}, ${formatEventTime(eventEnd)}`;
  };

  const getTaskTimingHint = (item: ManifestItemDraft) => {
    if (!item.eventStart || !item.eventEnd) return null;

    if (item.type === "Delivery" || item.type === "Setup") {
      return `Event starts at ${formatEventTime(item.eventStart)}`;
    }

    if (item.type === "Teardown" || item.type === "Pickup") {
      return `Event ends at ${formatEventTime(item.eventEnd)}`;
    }

    return null;
  };

  const eventOptions = eventOptionsRaw.map((event) => {
    const eventWindow = formatEventWindow(event.eventStart, event.eventEnd);

    return {
      value: event.uid,
      label: event.eventName,
      subLabel: `${event.location}${eventWindow ? ` • ${eventWindow}` : ""}`,
    };
  });

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
        eventStart: selectedEvent.eventStart,
        eventEnd: selectedEvent.eventEnd,
      },
    ]);
  };

  const removeManifestItem = (id: string) => {
    setManifestItems((prev) =>
      resequenceManifestItems(prev.filter((item) => item.id !== id)),
    );
  };

  const handleManifestDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setManifestItems((prev) => {
      const oldIndex = prev.findIndex((item) => item.id === active.id);
      const newIndex = prev.findIndex((item) => item.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return prev;

      return resequenceManifestItems(arrayMove(prev, oldIndex, newIndex));
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
          eventStart: event.eventStart,
          eventEnd: event.eventEnd,
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
        eventStart: item.eventStart,
        eventEnd: item.eventEnd,
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleManifestDragEnd}
              >
                <SortableContext
                  items={manifestItems.map((item) => item.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {manifestItems.map((item) => (
                    <SortableManifestItem
                      key={item.id}
                      item={item}
                      formatManifestType={formatManifestType}
                      formatEventWindow={formatEventWindow}
                      getTaskTimingHint={getTaskTimingHint}
                      removeManifestItem={removeManifestItem}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            )}
          </div>
        </section>
      </div>

      <div className="flex justify-end pt-4 pb-2">
        <div className="w-40">
          <SubmitButton label={mode === "edit" ? "Save Run" : "Create Run"} />
        </div>
      </div>
    </form>
  );
};

export default NewRunForm;
