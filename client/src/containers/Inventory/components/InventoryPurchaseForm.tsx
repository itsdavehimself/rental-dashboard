import { useForm, type SubmitHandler } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import CurrencyInput from "../../../components/common/CurrencyInput";
import SubmitButton from "../../../components/common/SubmitButton";
import { useEffect } from "react";
import { toCamelCasePath } from "../../../helpers/toCamelCasePath";

export type InventoryPurchaseInput = {
  quantity: number;
  unitCost: number;
  vendorName: string;
};

interface InventoryPurchaseFormProps {
  onSubmit: SubmitHandler<InventoryPurchaseInput>;
  errors: object | null;
  item: { uid: string; name: string } | null;
}

const InventoryPurchaseForm: React.FC<InventoryPurchaseFormProps> = ({
  onSubmit,
  errors,
  item,
}) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<InventoryPurchaseInput>();

  const unitCost = watch("unitCost");

  useEffect(() => {
    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
      clearErrors();

      Object.entries(errors).forEach(([fieldName, errorMessages]) => {
        const fieldKey = toCamelCasePath(
          fieldName
        ) as keyof InventoryPurchaseInput;

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
        placeholder={""}
        disabled={true}
        defaultText={item?.name}
      />
      <StyledInput
        label="Quantity"
        placeholder="100"
        register={register("quantity", { valueAsNumber: true })}
        error={formErrors.quantity?.message}
      />
      <CurrencyInput
        label="Unit Cost"
        value={unitCost}
        onValueChange={(val) => setValue("unitCost", val)}
      />
      <StyledInput
        label="Vendor"
        placeholder="Home Depot"
        register={register("vendorName")}
        error={formErrors.vendorName?.message}
        optional={true}
      />
      <div className="self-center w-1/4">
        <SubmitButton label="Add" />
      </div>
    </form>
  );
};

export default InventoryPurchaseForm;
