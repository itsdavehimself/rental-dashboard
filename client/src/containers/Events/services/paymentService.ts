import { CustomError } from "../../../types/CustomError";
import type { PaymentInputs } from "../CreateEvent/components/PaymentForm";
import type { Payment } from "../types/Event";

const addCashPayment = async (
  apiUrl: string,
  data: PaymentInputs,
  eventUid: string,
  userUid: string
): Promise<Payment> => {
  const response = await fetch(`${apiUrl}/api/events/${eventUid}/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      date: data.date,
      notes: data.notes,
      amount: data.amount ? data.amount / 100 : 0,
      paymentMethod: "Cash",
      collectedByUid: userUid,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Adding cash payment failed.", errorData);
  }

  return await response.json();
};

export { addCashPayment };
