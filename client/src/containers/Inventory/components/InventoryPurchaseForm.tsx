import { useForm, type SubmitHandler } from "react-hook-form";
import type { InventoryType } from "../../../types/InventoryConfigResponse";
import StyledInput from "../../../components/common/StyledInput";
import CurrencyInput from "../../../components/common/CurrencyInput";
import SubmitButton from "../../../components/common/SubmitButton";

export type InventoryPurchaseInput = {
  quantity: number;
  unitCost: number;
  vendorName: string;
};

interface InventoryPurchaseFormProps {
  onSubmit: SubmitHandler<InventoryPurchaseInput>;
  errors: object | null;
  types: InventoryType[];
  item: { uid: string; name: string } | null;
}

const InventoryPurchaseForm: React.FC<InventoryPurchaseFormProps> = ({
  onSubmit,
  errors,
  types,
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
