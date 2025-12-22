import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../../../hooks/useClickOutside";
import { useCreateEvent } from "../../hooks/useCreateEvent";
import type { ErrorsState } from "../../../../helpers/handleError";
import XButton from "../../../../components/common/XButton";
import Dropdown from "../../../../components/common/Dropdown";
import { PAYMENT_METHODS } from "../../../../config/PAYMENT_TYPES";
import { useForm } from "react-hook-form";
import CashPaymentForm from "./CashPaymentForm";
import StripePaymentForm from "../../../Clients/components/StripePaymentForm";
import TransactionRow from "../../../../components/common/TransactionRow";

export type PaymentInputs = {
  paymentMethod: string;
  amount: number;
  date: Date;
  notes: string;
  amountToCharge: number;
};

const PaymentModal: React.FC = () => {
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
  const { setOpenModal, amountDue, transactions } = useCreateEvent();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorsState | null>(null);
  const [view, setView] = useState<"add" | "view" | null>("add");

  const paymentMethod = watch("paymentMethod");
  const amount = watch("amount");
  const date = watch("date");
  const amountToCharge = watch("amountToCharge");

  useClickOutside(modalRef, () => {
    setOpenModal(null);
  });

  const toggleView = () => {
    setView((prev) => (prev === "view" ? "add" : "view"));
  };

  useEffect(() => {
    if (amountDue === 0) setView("view");
  }, []);

  return (
    <section
      ref={modalRef}
      className="relative bg-white h-fit w-fit lg:min-w-120 shadow-md rounded-2xl z-10 py-4"
    >
      <div className="flex justify-between items-center pl-6 pr-4 mb-4">
        <div className="flex justify-center gap-6 items-baseline">
          <h4 className="text-lg font-semibold">
            {view === "add" ? "Add Payment" : "View Payments"}
          </h4>
          <button
            onClick={toggleView}
            className="text-xs text-gray-400 font-semibold hover:cursor-pointer hover:text-primary transition-all duration-200"
          >
            {view === "add" ? "View Payments" : "Add Payment"}
          </button>
        </div>
        <XButton setIsModalOpen={setOpenModal} setErrors={setErrors} />
      </div>
      {view === "view" && (
        <div className="flex flex-col px-8 gap-6 mb-4 max-h-100 overflow-scroll">
          {transactions.length === 0 && (
            <p className="self-center text-sm text-gray-400">
              There are no payments related to this event.
            </p>
          )}
          {transactions
            .sort(
              (a, b) =>
                new Date(b.occurredAt).getTime() -
                new Date(a.occurredAt).getTime()
            )
            .map((t) => (
              <TransactionRow key={t.uid} transaction={t} />
            ))}
        </div>
      )}
      {view === "add" && (
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
          {paymentMethod === "Card" && (
            <StripePaymentForm
              amountToCharge={amountToCharge}
              setValue={setValue}
            />
          )}
        </div>
      )}
    </section>
  );
};

export default PaymentModal;
