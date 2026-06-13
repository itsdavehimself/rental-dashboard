import { useForm } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import TextAreaInput from "../../../components/common/TextAreaInput";
import SubmitButton from "../../../components/common/SubmitButton";
import Dropdown from "../../../components/common/Dropdown";
import DatePicker from "../../../components/common/DatePicker";
import { useState, useRef } from "react";
import { useClickOutside } from "../../../hooks/useClickOutside";

export type RetirementInput = {
  quantity: number;
  reason: number;
  dateRetired: Date;
  notes: string;
};

interface Props {
  onSubmit: (data: RetirementInput) => void;
  maxQuantity: number;
}

const REASON_OPTIONS = [
  { value: 0, label: "Broken / Damaged" },
  { value: 1, label: "Lost" },
  { value: 2, label: "Sold" },
  { value: 3, label: "Stolen" },
];

const InventoryRetirementForm: React.FC<Props> = ({
  onSubmit,
  maxQuantity,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RetirementInput>({
    defaultValues: {
      reason: 0,
      dateRetired: new Date(),
    },
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setOpenDropdown(null));

  const currentReason = watch("reason");
  const dateRetired = watch("dateRetired");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <StyledInput
          label="Quantity to Retire"
          placeholder="1"
          register={register("quantity", {
            valueAsNumber: true,
            required: "Required",
            min: { value: 1, message: "Must retire at least 1" },
            max: {
              value: maxQuantity,
              message: `Only ${maxQuantity} available`,
            },
          })}
          error={errors.quantity?.message}
        />
        <DatePicker
          label="Date"
          date={dateRetired}
          onSelect={(val) => setValue("dateRetired", val)}
          disablePastDates={false}
        />
      </div>

      <Dropdown
        ref={dropdownRef}
        label="Reason"
        value={currentReason}
        options={REASON_OPTIONS}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        selectedLabel={
          REASON_OPTIONS.find((o) => o.value === currentReason)?.label ||
          "Select Reason"
        }
        onChange={(val) => setValue("reason", val as number)}
      />

      <TextAreaInput
        label="Notes / Details"
        register={register("notes")}
        rows={3}
        optional
      />

      <div className="flex justify-end mt-4">
        <SubmitButton label="Retire Stock" />
      </div>
    </form>
  );
};

export default InventoryRetirementForm;
