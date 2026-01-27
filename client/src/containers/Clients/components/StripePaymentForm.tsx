import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { useCreateEvent } from "../../Events/hooks/useCreateEvent";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import CurrencyInput from "../../../components/common/CurrencyInput";
import ActionButton from "../../../components/common/ActionButton";
import { CreditCard } from "lucide-react";
import { createPaymentIntent } from "../../Events/services/stripeService";
import { handleError } from "../../../helpers/handleError";
import { useToast } from "../../../hooks/useToast";
import CheckoutForm from "./CheckoutForm";
import { type PaymentInputs } from "../../Events/CreateEvent/components/TransactionModal";
import { type UseFormSetValue } from "react-hook-form";
import { useBilling } from "../../Events/hooks/useBilling";

const stripePromise = loadStripe(
  "pk_test_51STRZaIcwD9bUrYq0k0heSIBjgcYCwiDiVcuNoMbc0WaBXwchYCGeQq3f19Q9XiVdmMxWiScqkkd2CRvRNoewDa800J6cMQLhU",
);

const apiUrl = import.meta.env.VITE_API_BASE_URL;

interface Props {
  amountToCharge: number;
  setValue: UseFormSetValue<PaymentInputs>;
}

const StripePaymentForm: React.FC<Props> = ({ amountToCharge, setValue }) => {
  const { eventBilling, eventUid } = useCreateEvent();
  const { amountDue } = useBilling();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Error | null>(null);

  const { addToast } = useToast();

  useEffect(() => {
    if (!amountToCharge) {
      setValue("amountToCharge", amountDue * 100);
    }
  }, [amountDue]);

  const overcharge = amountToCharge / 100 > amountDue;

  const startPaymentIntent = async () => {
    try {
      if (!eventBilling?.email || !eventUid) return;
      setIsLoading(true);

      const secret = await createPaymentIntent(
        apiUrl,
        eventUid,
        amountToCharge,
        eventBilling.email,
      );

      setClientSecret(secret);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "Error creating payment intent. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!clientSecret && !isLoading && (
        <section className="flex flex-col gap-6 justify-center items-center">
          <CurrencyInput
            label="Amount"
            value={amountToCharge}
            onValueChange={(val) => setValue("amountToCharge", val)}
          />

          {overcharge && (
            <p className="text-red-500 text-sm">
              Amount cannot exceed amount due.
            </p>
          )}

          <ActionButton
            label="Pay with Card"
            icon={CreditCard}
            style="filled"
            onClick={startPaymentIntent}
            disabled={overcharge || !amountToCharge}
          />
        </section>
      )}

      {isLoading && (
        <div className="flex justify-center py-6">
          <LoadingSpinner dimensions={{ x: 6, y: 6 }} />
        </div>
      )}

      {clientSecret && !isLoading && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm amountToCharge={amountToCharge} />
        </Elements>
      )}
    </>
  );
};

export default StripePaymentForm;
