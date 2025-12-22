import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import SubmitButton from "../../../components/common/SubmitButton";
import { useCreateEvent } from "../../Events/hooks/useCreateEvent";
import { useToast } from "../../../hooks/useToast";
import { handleError } from "../../../helpers/handleError";
import { type ErrorsState } from "../../../helpers/handleError";
import { addCardPayment } from "../../Events/services/paymentService";
import { useAppSelector } from "../../../app/hooks";

interface Props {
  amountToCharge: number;
}

const CheckoutForm: React.FC<Props> = ({ amountToCharge }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { setOpenModal, eventUid, setTransactions } = useCreateEvent();
  const { addToast } = useToast();
  const user = useAppSelector((state) => state.user.user);

  const [errors, setErrors] = useState<ErrorsState | null>(null);

  const [status, setStatus] = useState<
    "idle" | "processing" | "succeeded" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setStatus("processing");
    setErrorMessage(null);

    const onSuccess = async () => {
      try {
        if (!eventUid || !user || !paymentIntent) return;
        setStatus("succeeded");
        setErrors(null);
        const transaction = await addCardPayment(
          apiUrl,
          amountToCharge,
          eventUid,
          user?.uid,
          paymentIntent?.id
        );
        setTransactions((prev) => [...prev, transaction]);
        setOpenModal(null);
        addToast(
          "Success",
          `$${(amountToCharge / 100).toFixed(2)} payment successfully added.`
        );
      } catch (err) {
        handleError(err, setErrors);
      }
    };

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message ?? "Payment failed.");
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      onSuccess();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 justify-center items-center"
    >
      <div className="text-lg font-semibold">
        Amount ${(amountToCharge / 100).toFixed(2)}
      </div>

      <PaymentElement />

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}

      <SubmitButton
        label={"Submit Payment"}
        loading={status === "processing"}
        full={false}
      />
    </form>
  );
};

export default CheckoutForm;
