import { useForm, type SubmitHandler } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import SubmitButton from "../../../components/common/SubmitButton";
import { useEffect, useState, useRef } from "react";
import TextAreaInput from "../../../components/common/TextAreaInput";
import { toCamelCasePath } from "../../../helpers/toCamelCasePath";
import Dropdown from "../../../components/common/Dropdown";
import CurrencyInput from "../../../components/common/CurrencyInput";
import type { InventoryType } from "../types/InventoryConfigResponse";
import { createInventoryItem } from "../services/inventoryService";
import { useToast } from "../../../hooks/useToast";
import { handleError, type ErrorsState } from "../../../helpers/handleError";
import { type InventoryListItem } from "../types/InventoryItem";
import { type InventoryModalType } from "../Inventory";

export type InventoryItemInput = {
  description: string;
  type: number;
  subType: number;
  color: number;
  notes: string;
  length: number;
  width: number;
  height: number;
  unitPrice: number;
  material: number;
  variant: string;
};

interface InventoryItemFormProps {
  errors: object | null;
  types: InventoryType[];
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
  setItems: React.Dispatch<React.SetStateAction<InventoryListItem[]>>;
  items: InventoryListItem[];
  setOpenModal: React.Dispatch<React.SetStateAction<InventoryModalType>>;
}

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({
  errors,
  types,
  setErrors,
  setItems,
  items,
  setOpenModal,
}) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<InventoryItemInput>();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const unitPrice = watch("unitPrice");
  const type = watch("type");
  const subType = watch("subType");
  const material = watch("material");
  const color = watch("color");

  const selectedType = types.find((t) => t.id === type);
  const selectedSubType = selectedType?.subTypes.find(
    (st) => st.id === subType
  );

  const typeRef = useRef<HTMLDivElement>(null);
  const subTypeRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  const onSubmit: SubmitHandler<InventoryItemInput> = async (data) => {
    try {
      setErrors(null);
      const newItem = await createInventoryItem(apiUrl, data);

      const updatedItems = [...items, newItem].sort((a, b) => {
        return a.sku.localeCompare(b.sku);
      });

      setItems(updatedItems);
      setOpenModal(null);
      addToast("Success", `${newItem.sku} successfully added.`);
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  useEffect(() => {
    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
      clearErrors();

      Object.entries(errors).forEach(([fieldName, errorMessages]) => {
        const fieldKey = toCamelCasePath(fieldName) as keyof InventoryItemInput;

        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          setError(fieldKey, {
            type: "server",
            message: errorMessages[0],
          });
        }
      });
    }
  }, [errors, setError, clearErrors]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        !typeRef.current?.contains(event.target as Node) &&
        !subTypeRef.current?.contains(event.target as Node) &&
        !colorRef.current?.contains(event.target as Node) &&
        !materialRef.current?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (formErrors.type || formErrors.subType) {
      if (type && formErrors.type) {
        clearErrors("type");
      }
      if (subType && formErrors.subType) {
        clearErrors("subType");
      }
    }
  }, [type, subType, clearErrors, formErrors.type, formErrors.subType]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center px-8 pt-4 gap-4"
    >
      <StyledInput
        label="Item"
        placeholder="6ft White Resin Folding Table"
        register={register("description")}
        error={formErrors.description?.message}
      />
      <div className="flex gap-4">
        <StyledInput
          label="Length"
          placeholder="72"
          register={register("length", { valueAsNumber: true })}
          error={formErrors.length?.message}
          optional={true}
        />
        <StyledInput
          label="Width"
          placeholder="30"
          register={register("width", { valueAsNumber: true })}
          error={formErrors.width?.message}
          optional={true}
        />
        <StyledInput
          label="Height"
          placeholder="36"
          register={register("height", { valueAsNumber: true })}
          error={formErrors.height?.message}
          optional={true}
        />
      </div>
      <Dropdown
        ref={typeRef}
        label="Type"
        value={type}
        options={types.map((t) => ({ value: t.id, label: t.label }))}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        selectedLabel={types.find((t) => t.id === type)?.label ?? "Type"}
        onChange={(val) => setValue("type", val as number)}
        error={formErrors.type?.message}
      />
      {selectedType && selectedType.subTypes.length > 0 && (
        <Dropdown
          ref={subTypeRef}
          label="SubType"
          value={subType}
          options={selectedType.subTypes.map((st) => ({
            value: st.id,
            label: st.label,
          }))}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          selectedLabel={
            selectedType.subTypes.find((st) => st.id === subType)?.label ??
            "SubType"
          }
          onChange={(val) => setValue("subType", val as number)}
          error={formErrors.subType?.message}
        />
      )}
      {selectedSubType && selectedSubType.materials.length > 0 && (
        <Dropdown
          ref={materialRef}
          label="Material"
          value={material}
          options={selectedSubType.materials.map((m) => ({
            value: m.id,
            label: m.label,
          }))}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          selectedLabel={
            selectedSubType.materials.find((m) => m.id === material)?.label ??
            "Material"
          }
          onChange={(val) => setValue("material", val as number)}
          error={formErrors.material?.message}
        />
      )}
      {selectedSubType && selectedSubType.colors.length > 0 && (
        <Dropdown
          ref={colorRef}
          label="Color"
          value={color}
          options={selectedSubType.colors.map((c) => ({
            value: c.id,
            label: c.label,
          }))}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          selectedLabel={
            selectedSubType.colors.find((c) => c.id === color)?.label ?? "Color"
          }
          onChange={(val) => setValue("color", val as number)}
          error={formErrors.color?.message}
        />
      )}
      <CurrencyInput
        label="Unit Price"
        value={unitPrice}
        onValueChange={(val) => setValue("unitPrice", val)}
      />
      <StyledInput
        label="Variant Label"
        placeholder="Round, Heavy Duty, Indoor, Outdoor, V1, etc."
        register={register("variant")}
        error={formErrors.variant?.message}
        optional={true}
      />
      <TextAreaInput
        label="Notes"
        register={register("notes")}
        optional={true}
      />
      <div className="self-center w-1/4">
        <SubmitButton label="Add" />
      </div>
    </form>
  );
};

export default InventoryItemForm;
