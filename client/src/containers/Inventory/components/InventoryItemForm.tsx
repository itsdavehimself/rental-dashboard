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
import { useAppDispatch } from "../../../app/hooks";
import { closeModal } from "../../../app/slices/uiSlice";
import { Camera } from "lucide-react";

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
  bounceHouseType: number;
  variant: string;
};

interface InventoryItemFormProps {
  errors: object | null;
  types: InventoryType[];
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
  setItems: React.Dispatch<React.SetStateAction<InventoryListItem[]>>;
  items: InventoryListItem[];
}

const InventoryItemForm: React.FC<InventoryItemFormProps> = ({
  errors,
  types,
  setErrors,
  setItems,
  items,
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const unitPrice = watch("unitPrice");
  const type = watch("type");
  const subType = watch("subType");
  const material = watch("material");
  const color = watch("color");
  const bounceHouseType = watch("bounceHouseType");

  const selectedType = types.find((t) => t.id === type);
  const selectedSubType = selectedType?.subTypes.find(
    (st) => st.id === subType,
  );

  const typeRef = useRef<HTMLDivElement>(null);
  const subTypeRef = useRef<HTMLDivElement>(null);
  const materialRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);
  const bounceHouseTypeRef = useRef<HTMLDivElement>(null);

  // --- IMAGE UPLOAD HANDLERS ---
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a local preview URL for the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- SUBMIT HANDLER ---
  const onSubmit: SubmitHandler<InventoryItemInput> = async (data) => {
    try {
      setErrors(null);

      const payload = {
        ...data,
        unitPrice: data.unitPrice ? Number(data.unitPrice) : 0,
        length: Number.isNaN(data.length) ? null : data.length,
        width: Number.isNaN(data.width) ? null : data.width,
        height: Number.isNaN(data.height) ? null : data.height,
      };

      // TODO: If you update your C# backend to accept multipart/form-data for images,
      // you will append the fileInputRef.current.files[0] to a FormData object here instead!
      const newItem = await createInventoryItem(apiUrl, payload as any);

      const updatedItems = [...items, newItem].sort((a, b) => {
        return a.sku.localeCompare(b.sku);
      });

      setItems(updatedItems);
      dispatch(closeModal());
      addToast("Success", `${newItem.sku} successfully added.`);
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  // --- EFFECTS ---
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
        !materialRef.current?.contains(event.target as Node) &&
        !bounceHouseTypeRef.current?.contains(event.target as Node)
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
      className="flex flex-col gap-8 px-6 pt-4 pb-2 w-full min-w-[800px]"
    >
      <div className="flex flex-row gap-8 w-full">
        {/* --- LEFT COLUMN: IMAGE UPLOAD --- */}
        <div className="flex flex-col items-center gap-3 w-1/4 pt-6">
          <div
            onClick={handleImageClick}
            className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex-shrink-0 group cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col gap-2 items-center justify-center">
                <Camera className="w-10 h-10 text-gray-400" />
                <span className="text-xs font-semibold text-gray-400">
                  Add Photo
                </span>
              </div>
            )}

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-xs font-semibold tracking-wider uppercase">
                {imagePreview ? "Change Photo" : "Upload Photo"}
              </span>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* --- RIGHT COLUMN: FORM FIELDS --- */}
        <div className="flex flex-col gap-5 w-3/4">
          <StyledInput
            label="Item Description"
            placeholder="e.g. 6ft White Resin Folding Table"
            register={register("description")}
            error={formErrors.description?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Dropdown
              ref={typeRef}
              label="Type"
              value={type}
              options={types.map((t) => ({ value: t.id, label: t.label }))}
              openDropdown={openDropdown}
              setOpenDropdown={setOpenDropdown}
              selectedLabel={
                types.find((t) => t.id === type)?.label ?? "Select a type"
              }
              onChange={(val) => setValue("type", val as number)}
              error={formErrors.type?.message}
            />
            {selectedType && selectedType.subTypes.length > 0 ? (
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
                  selectedType.subTypes.find((st) => st.id === subType)
                    ?.label ?? "Select a sub-type"
                }
                onChange={(val) => setValue("subType", val as number)}
                error={formErrors.subType?.message}
              />
            ) : (
              <div />
            )}{" "}
            {/* Empty div to maintain grid alignment if no subType */}
          </div>

          {/* Dynamic Attributes Row */}
          {selectedSubType && (
            <>
              {selectedSubType.bounceHouseTypes.length > 0 && (
                <div className="grid grid-cols-1 gap-4">
                  <Dropdown
                    ref={bounceHouseTypeRef}
                    label="Theme/Style"
                    value={bounceHouseType}
                    options={selectedSubType.bounceHouseTypes.map((b) => ({
                      value: b.id,
                      label: b.label,
                    }))}
                    openDropdown={openDropdown}
                    setOpenDropdown={setOpenDropdown}
                    selectedLabel={
                      selectedSubType.bounceHouseTypes.find(
                        (b) => b.id === bounceHouseType,
                      )?.label ?? "Select theme"
                    }
                    onChange={(val) =>
                      setValue("bounceHouseType", val as number)
                    }
                    error={formErrors.bounceHouseType?.message}
                  />
                </div>
              )}

              {selectedSubType.materials.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
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
                      selectedSubType.materials.find((m) => m.id === material)
                        ?.label ?? "Select material"
                    }
                    onChange={(val) => setValue("material", val as number)}
                    error={formErrors.material?.message}
                  />
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
                      selectedSubType.colors.find((c) => c.id === color)
                        ?.label ?? "Select color"
                    }
                    onChange={(val) => setValue("color", val as number)}
                    error={formErrors.color?.message}
                  />
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-2 gap-4">
            <StyledInput
              label="Variant Label"
              placeholder="e.g. Round, Heavy Duty, V1"
              register={register("variant")}
              error={formErrors.variant?.message}
              optional={true}
            />
            <CurrencyInput
              label="Rental Price"
              value={unitPrice}
              onValueChange={(val) => setValue("unitPrice", val)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <StyledInput
              label="Length (in)"
              placeholder="0"
              register={register("length", { valueAsNumber: true })}
              error={formErrors.length?.message}
              optional={true}
            />
            <StyledInput
              label="Width (in)"
              placeholder="0"
              register={register("width", { valueAsNumber: true })}
              error={formErrors.width?.message}
              optional={true}
            />
            <StyledInput
              label="Height (in)"
              placeholder="0"
              register={register("height", { valueAsNumber: true })}
              error={formErrors.height?.message}
              optional={true}
            />
          </div>

          <TextAreaInput
            label="Internal Notes"
            register={register("notes")}
            optional={true}
          />
        </div>
      </div>

      {/* --- BOTTOM ACTIONS --- */}
      <div className="flex justify-end">
        <div className="w-40">
          <SubmitButton label="Create Item" />
        </div>
      </div>
    </form>
  );
};

export default InventoryItemForm;
