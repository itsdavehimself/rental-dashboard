import CurrencyInput from "../../../../components/common/CurrencyInput";
import DatePicker from "../../../../components/common/DatePicker";
import SubmitButton from "../../../../components/common/SubmitButton";
import TextAreaInput from "../../../../components/common/TextAreaInput";
import type {
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  SubmitHandler,
} from "react-hook-form";
import type { PaymentInputs } from "./TransactionModal";
import { handleError, type ErrorsState } from "../../../../helpers/handleError";
import { useState, useEffect } from "react";
import { useToast } from "../../../../hooks/useToast";
import { addCashPayment } from "../../services/transactionService";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import sortTransactions from "../../helpers/sortTransactions";
import { useBilling } from "../../hooks/useBilling";
import { closeModal } from "../../../../app/slices/uiSlice";

interface CashPaymentFormProps {
  handleSubmit: UseFormHandleSubmit<PaymentInputs, PaymentInputs>;
  register: UseFormRegister<PaymentInputs>;
  setValue: UseFormSetValue<PaymentInputs>;
  amountToCharge: number;
  date: Date;
}

const CashPaymentForm: React.FC<CashPaymentFormProps> = ({
  amountToCharge,
  date,
  register,
  setValue,
  handleSubmit,
}) => {
  const [errors, setErrors] = useState<ErrorsState | null>(null);
  const { addToast } = useToast();
  const { eventUid, setTransactions, amountDue } = useBilling();
  const user = useAppSelector((state) => state.user.user);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<PaymentInputs> = async (data) => {
    try {
      if (!eventUid || !user) return;
      setErrors(null);
      const transaction = await addCashPayment(
        apiUrl,
        data,
        eventUid,
        user?.uid,
      );
      setTransactions((prev) => sortTransactions([...prev, transaction]));
      addToast(
        "Success",
        `$${(amountToCharge / 100).toFixed(2)} cash payment successfully added.`,
      );
      dispatch(closeModal());
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  useEffect(() => {
    if (!amountToCharge) {
      setValue("amountToCharge", amountDue * 100);
    }
  }, [amountDue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <CurrencyInput
        label="Amount"
        value={amountToCharge}
        onValueChange={(val) => setValue("amountToCharge", val)}
      />
      <DatePicker
        label="Payment Date"
        date={date}
        onSelect={(val) => setValue("date", val)}
        disablePastDates={false}
      />
      <TextAreaInput
        label="Note"
        register={register("notes")}
        optional={true}
      />
      {amountToCharge / 100 > amountDue && (
        <p className="self-center text-red-500 text-sm">
          Amount cannot exceed amount due.
        </p>
      )}
      <div className="flex self-center w-1/2">
        <SubmitButton
          label="Add Payment"
          disabled={
            amountToCharge === 0 ||
            amountToCharge === undefined ||
            amountToCharge / 100 > amountDue
          }
        />
      </div>
    </form>
  );
};

export default CashPaymentForm;
