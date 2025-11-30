import { useRef, useState } from "react";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import { useCreateEvent } from "../../hooks/useCreateEvent";
import type { ErrorsState } from "../../../../helpers/handleError";
import XButton from "../../../../components/common/XButton";
import Dropdown from "../../../../components/common/Dropdown";
import { PAYMENT_METHODS } from "../../../../config/PAYMENT_TYPES";
import { useForm } from "react-hook-form";
import CashPaymentForm from "./CashPaymentForm";

interface PaymentFormProps {}

export type PaymentInputs = {
  paymentMethod: string;
  amount: number;
  date: Date;
  notes: string;
};

const PaymentForm: React.FC<PaymentFormProps> = () => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<PaymentInputs>({
    defaultValues: { paymentMethod: "Cash", date: new Date() },
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const paymentMethodRef = useRef<HTMLDivElement>(null);
  const { setOpenModal } = useCreateEvent();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorsState | null>(null);

  const paymentMethod = watch("paymentMethod");
  const amount = watch("amount");
  const date = watch("date");

  useClickOutside(modalRef, () => {
    setOpenModal(null);
  });

  return (
    <section
      ref={modalRef}
      className="relative bg-white h-fit w-fit lg:min-w-120 shadow-md rounded-2xl z-10 py-4"
    >
      <div className="flex justify-between items-center pl-6 pr-4 mb-4">
        <h4 className="text-lg font-semibold">Add Payment</h4>
        <XButton setIsModalOpen={setOpenModal} setErrors={setErrors} />
      </div>
      <div className="flex flex-col gap-4 px-6">
        <Dropdown
          label="Payment Method"
          value={paymentMethod}
          selectedLabel={
            PAYMENT_METHODS.find((p) => p.value === paymentMethod)?.label ??
            "Select a payment method"
          }
          options={PAYMENT_METHODS}
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          ref={paymentMethodRef}
          onChange={(val) => setValue("paymentMethod", val as string)}
          error={formErrors.paymentMethod?.message}
        />
        {paymentMethod === "Cash" && (
          <CashPaymentForm
            handleSubmit={handleSubmit}
            register={register}
            setValue={setValue}
            amount={amount}
            date={date}
          />
        )}
      </div>
    </section>
  );
};

export default PaymentForm;
