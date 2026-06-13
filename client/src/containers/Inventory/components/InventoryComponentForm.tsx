import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import StyledInput from "../../../components/common/StyledInput";
import Dropdown from "../../../components/common/Dropdown";
import SubmitButton from "../../../components/common/SubmitButton";

export type InventoryComponentInput = {
  childItemUid: string;
  quantity: number;
  isRequired: boolean;
};

interface Props {
  onSubmit: (data: InventoryComponentInput) => void;
  currentItemUid: string;
}

const REQUIRED_OPTIONS = [
  { value: 1, label: "Yes (Automatically pulled)" },
  { value: 0, label: "No (Optional add-on)" },
];

const InventoryComponentForm: React.FC<Props> = ({
  onSubmit,
  currentItemUid,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InventoryComponentInput>({
    defaultValues: { quantity: 1, isRequired: true },
  });

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // State for the new filtering system
  const [types, setTypes] = useState<{ id: number; label: string }[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | "">("");
  const [items, setItems] = useState<{ value: string; label: string }[]>([]);

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const typeDropdownRef = useRef<HTMLDivElement>(null);
  const itemDropdownRef = useRef<HTMLDivElement>(null);
  const requiredDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    register("childItemUid", { required: "Please select an item" });
    register("isRequired");
  }, [register]);

  // Click outside logic updated to include the new Type dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        !typeDropdownRef.current?.contains(event.target as Node) &&
        !itemDropdownRef.current?.contains(event.target as Node) &&
        !requiredDropdownRef.current?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  // 1. Fetch available Item Types for the filter
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/Inventory/config`, {
          credentials: "include",
        });
        const data = await response.json();
        setTypes(data.types);
      } catch (err) {
        console.error("Failed to fetch inventory types");
      }
    };
    fetchTypes();
  }, [apiUrl]);

  // 2. Fetch Items (Filtered by the selected TypeId)
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const typeQuery = selectedTypeId ? `&TypeId=${selectedTypeId}` : "";
        const response = await fetch(
          `${apiUrl}/api/Inventory?pageSize=100${typeQuery}`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        const options = data.data
          .filter((item: any) => item.uid !== currentItemUid)
          .map((item: any) => ({
            value: item.uid,
            label: `[${item.sku}] ${item.description}`,
          }));

        setItems(options);
      } catch (err) {
        console.error("Failed to fetch items for dropdown");
      }
    };
    fetchItems();
  }, [apiUrl, currentItemUid, selectedTypeId]);

  const childItemUid = watch("childItemUid");
  const isRequired = watch("isRequired");

  // Format type options with a default "All Categories" option
  const typeOptions = [
    { value: "", label: "All Categories" },
    ...types.map((t) => ({ value: t.id, label: t.label })),
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center px-8 pt-4 gap-4"
    >
      {/* NEW: Category Filter Dropdown */}
      <Dropdown
        ref={typeDropdownRef}
        label="Filter by Category (Optional)"
        value={selectedTypeId}
        options={typeOptions}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        selectedLabel={
          typeOptions.find((t) => t.value === selectedTypeId)?.label ??
          "All Categories"
        }
        onChange={(val) => setSelectedTypeId(val as number | "")}
        error={undefined}
      />

      <Dropdown
        ref={itemDropdownRef}
        label="Select Component to Link"
        value={childItemUid}
        options={items}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        selectedLabel={
          items.find((i) => i.value === childItemUid)?.label ??
          "Select an item..."
        }
        onChange={(val) =>
          setValue("childItemUid", val as string, { shouldValidate: true })
        }
        error={errors.childItemUid?.message}
      />

      <div className="grid grid-cols-2 gap-4">
        <StyledInput
          label="Quantity Included"
          placeholder="e.g. 8"
          register={register("quantity", {
            required: "Required",
            min: { value: 1, message: "Must be at least 1" },
            valueAsNumber: true,
          })}
          error={errors.quantity?.message}
        />

        <Dropdown
          ref={requiredDropdownRef}
          label="Required Component?"
          value={isRequired ? 1 : 0}
          options={REQUIRED_OPTIONS}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          selectedLabel={
            REQUIRED_OPTIONS.find((o) => o.value === (isRequired ? 1 : 0))
              ?.label ?? "Select an option"
          }
          onChange={(val) => setValue("isRequired", val === 1)}
          error={undefined}
        />
      </div>

      <div className="self-center w-full mt-4">
        <SubmitButton label="Link Component" />
      </div>
    </form>
  );
};

export default InventoryComponentForm;
