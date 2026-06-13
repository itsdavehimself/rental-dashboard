import { useForm, type SubmitHandler } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import SubmitButton from "../../../components/common/SubmitButton";

export type ConfigItemInput = {
  label: string;
  skuCode?: string;
};

interface ConfigItemFormProps {
  initialData?: ConfigItemInput;
  onSubmit: SubmitHandler<ConfigItemInput>;
  isSubmitting?: boolean;
  requiresSku?: boolean;
}

const ConfigItemForm: React.FC<ConfigItemFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting,
  requiresSku = true,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConfigItemInput>({
    defaultValues: initialData,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <StyledInput
        label="Name / Label"
        placeholder="e.g. Folding Table"
        register={register("label", { required: "Label is required" })}
        error={errors.label?.message}
      />
      {requiresSku && (
        <StyledInput
          label="SKU Code"
          placeholder="e.g. FLD"
          register={register("skuCode", {
            required: requiresSku ? "SKU Code is required" : false,
            maxLength: { value: 3, message: "Limit to 3 characters" },
          })}
          error={errors.skuCode?.message}
        />
      )}
      <div className="flex justify-end mt-4">
        <SubmitButton label="Save" disabled={isSubmitting} />
      </div>
    </form>
  );
};

export default ConfigItemForm;
