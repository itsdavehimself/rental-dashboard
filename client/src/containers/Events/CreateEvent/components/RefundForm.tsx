import CurrencyInput from "../../../../components/common/CurrencyInput";
import SubmitButton from "../../../../components/common/SubmitButton";
import TextAreaInput from "../../../../components/common/TextAreaInput";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useAppSelector } from "../../../../app/hooks";
import { addRefund } from "../../services/transactionService";
import type { Transaction } from "../../types/Event";
import { useState, useEffect } from "react";
import type { ErrorsState } from "../../../../helpers/handleError";
import { useToast } from "../../../../hooks/useToast";
import { handleError } from "../../../../helpers/handleError";
import { useBilling } from "../../hooks/useBilling";
import sortTransactions from "../../helpers/sortTransactions";

interface RefundFormProps {
  selectedTransaction: Transaction | null;
  setView: React.Dispatch<
    React.SetStateAction<"add" | "refund" | "view" | "details" | null>
  >;
  relatedRefunds: Transaction[];
}

export type RefundInputs = {
  amount: number;
  notes: string;
  paymentMethod: string;
  date: Date;
};

const RefundForm: React.FC<RefundFormProps> = ({
  selectedTransaction,
  setView,
  relatedRefunds,
}) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors: formErrors },
  } = useForm<RefundInputs>({
    defaultValues: {
      paymentMethod: "Cash",
      date: new Date(),
      amount: 0,
    },
  });

  const [errors, setErrors] = useState<ErrorsState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const user = useAppSelector((state) => state.user.user);
  const { addToast } = useToast();
  const { setTransactions } = useBilling();

  const amount = watch("amount");

  const calculateRemainingBalance = () => {
    if (!selectedTransaction) return 0;
    const refundedSoFar = relatedRefunds.reduce(
      (sum, r) => sum + Math.abs(r.amount),
      0,
    );
    return (selectedTransaction.amount - refundedSoFar) * 100;
  };

  useEffect(() => {
    if (selectedTransaction) {
      reset({
        paymentMethod: "Cash",
        date: new Date(),
        amount: calculateRemainingBalance(),
      });
    }
  }, [selectedTransaction, relatedRefunds, reset]);

  const onSubmit: SubmitHandler<RefundInputs> = async (data) => {
    setIsLoading(true);
    try {
      if (!selectedTransaction || !user) return;
      setErrors(null);
      const transaction = await addRefund(
        apiUrl,
        selectedTransaction?.uid,
        user?.uid,
        data.amount,
        data.notes,
        selectedTransaction?.method,
      );
      setTransactions((prev) => sortTransactions([...prev, transaction]));
      addToast(
        "Success",
        `$${(data.amount / 100).toFixed(2)} refund successfully added.`,
      );
      setView("view");
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  return (
    <section className="flex flex-col gap-8">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <CurrencyInput
          label="Refund Amount"
          value={amount}
          onValueChange={(val) => setValue("amount", val)}
        />
        <TextAreaInput
          label="Refund Reason"
          optional={false}
          register={register("notes")}
        />
        <div className="flex self-center w-1/3">
          <SubmitButton label="Refund" destructive loading={isLoading} />
        </div>
      </form>
    </section>
  );
};

export default RefundForm;
