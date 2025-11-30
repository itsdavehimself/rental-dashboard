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
import type { PaymentInputs } from "./PaymentForm";
import { handleError, type ErrorsState } from "../../../../helpers/handleError";
import { useState } from "react";
import { useToast } from "../../../../hooks/useToast";
import { addCashPayment } from "../../services/paymentService";
import { useCreateEvent } from "../../hooks/useCreateEvent";
import { useAppSelector } from "../../../../app/hooks";

interface CashPaymentFormProps {
  handleSubmit: UseFormHandleSubmit<PaymentInputs, PaymentInputs>;
  register: UseFormRegister<PaymentInputs>;
  setValue: UseFormSetValue<PaymentInputs>;
  amount: number;
  date: Date;
}

const CashPaymentForm: React.FC<CashPaymentFormProps> = ({
  amount,
  date,
  register,
  setValue,
  handleSubmit,
}) => {
  const [errors, setErrors] = useState<ErrorsState | null>(null);
  const { addToast } = useToast();
  const { eventUid, setPayments, setOpenModal } = useCreateEvent();
  const user = useAppSelector((state) => state.user.user);
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const onSubmit: SubmitHandler<PaymentInputs> = async (data) => {
    try {
      if (!eventUid || !user) return;
      setErrors(null);
      const payment = await addCashPayment(apiUrl, data, eventUid, user?.uid);
      setPayments((prev) => [...prev, payment]);
      addToast("Success", ` successfully added to the team.`);
      setOpenModal(null);
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <CurrencyInput
        label="Amount"
        value={amount}
        onValueChange={(val) => setValue("amount", val)}
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
      <div className="flex self-center w-1/2">
        <SubmitButton label="Add Payment" />
      </div>
    </form>
  );
};

export default CashPaymentForm;
