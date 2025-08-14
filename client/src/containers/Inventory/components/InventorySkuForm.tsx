import { useForm, type SubmitHandler } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import SubmitButton from "../../../components/common/SubmitButton";
import { useEffect, useState, useRef } from "react";
import TextAreaInput from "../../../components/common/TextAreaInput";
import { toCamelCasePath } from "../../../helpers/toCamelCastPath";
import Dropdown from "../../../components/common/Dropdown";
import CurrencyInput from "../../../components/common/CurrencyInput";
import type { InventoryType } from "../../../types/InventoryConfigResponse";

export type InventorySkuInput = {
  item: string;
  type: number;
  subType: number;
  color: number;
  notes: string;
  length: number;
  width: number;
  height: number;
  unitPrice: number;
  material: number;
};

interface InventorySkuFormProps {
  onSubmit: SubmitHandler<InventorySkuInput>;
  errors: object | null;
  types: InventoryType[];
}

const InventorySkuForm: React.FC<InventorySkuFormProps> = ({
  onSubmit,
  errors,
  types,
}) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<InventorySkuInput>();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

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

  useEffect(() => {
    console.log(types);
  }, []);

  useEffect(() => {
    clearErrors();

    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
      Object.entries(errors).forEach(([fieldName, errorMessages]) => {
        const fieldKey = toCamelCasePath(fieldName) as keyof InventorySkuInput;

        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          setError(fieldKey, {
            type: "server",
            message: errorMessages[0],
          });
        }
      });
    }
  }, [errors, setError, clearErrors]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center px-8 pt-4 gap-4"
    >
      <StyledInput
        label="Item"
        placeholder="6ft White Resin Folding Table"
        register={register("item")}
        error={formErrors.item?.message}
      />
      <div className="flex gap-4">
        <StyledInput
          label="Length"
          placeholder="72"
          register={register("length")}
          error={formErrors.length?.message}
          optional={true}
        />
        <StyledInput
          label="Width"
          placeholder="30"
          register={register("width")}
          error={formErrors.width?.message}
          optional={true}
        />
        <StyledInput
          label="Height"
          placeholder="36"
          register={register("height")}
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
      <CurrencyInput
        label="Unit Price"
        value={unitPrice}
        onValueChange={(val) => setValue("unitPrice", val)}
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

export default InventorySkuForm;
