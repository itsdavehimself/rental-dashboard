import StyledInput from "../../../../components/common/StyledInput";
import TextAreaInput from "../../../../components/common/TextAreaInput";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface ItemInfoCardProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const ItemInfoCard: React.FC<ItemInfoCardProps> = ({ register, errors }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col gap-6 w-full">
      <h3 className="text-lg font-semibold text-gray-800">
        General Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <StyledInput
            label="Description"
            placeholder="Enter item description"
            register={register("description", {
              required: "Description is required",
            })}
            error={errors.description?.message as string}
          />
        </div>

        <StyledInput
          label="Rental Price ($)"
          placeholder="0.00"
          register={register("unitPrice", { valueAsNumber: true })}
        />
        <StyledInput
          label="Variant/Condition"
          placeholder="e.g. New, Used, Slightly Scuffed"
          register={register("variant")}
        />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mt-2">Dimensions</h3>
      <div className="grid grid-cols-3 gap-4">
        <StyledInput
          label="Length (in)"
          placeholder="0"
          register={register("length", { valueAsNumber: true })}
        />
        <StyledInput
          label="Width (in)"
          placeholder="0"
          register={register("width", { valueAsNumber: true })}
        />
        <StyledInput
          label="Height (in)"
          placeholder="0"
          register={register("height", { valueAsNumber: true })}
        />
      </div>

      <div className="mt-4">
        <TextAreaInput
          label="Internal Notes"
          placeholder="Add any internal notes here..."
          optional={true}
          register={register("notes")}
          rows={4}
        />
      </div>
    </div>
  );
};

export default ItemInfoCard;
