import { CustomError } from "../../../types/CustomError";
import type { PaymentInputs } from "../CreateEvent/components/TransactionModal";
import type { Transaction } from "../types/Event";
import type { PaymentMethod } from "../types/PaymentType";

const addCashPayment = async (
  apiUrl: string,
  data: PaymentInputs,
  eventUid: string,
  userUid: string
): Promise<Transaction> => {
  const response = await fetch(`${apiUrl}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      eventUid,
      date: data.date,
      notes: data.notes,
      amount: data.amount ? data.amount / 100 : 0,
      paymentMethod: "Cash",
      processedByUid: userUid,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Adding cash payment failed.", errorData);
  }

  return await response.json();
};

const addCardPayment = async (
  apiUrl: string,
  amount: number,
  eventUid: string,
  userUid: string,
  externalTransactionId: string
): Promise<Transaction> => {
  const response = await fetch(`${apiUrl}/api/events/${eventUid}/payment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      date: new Date(),
      amount: amount ? amount / 100 : 0,
      notes: null,
      paymentMethod: "Card",
      processedByUid: userUid,
      externalTransactionId,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Adding card payment failed.", errorData);
  }

  return await response.json();
};

const addRefund = async (
  apiUrl: string,
  transactionUid: string,
  userUid: string,
  amount: number,
  notes: string,
  paymentMethod: PaymentMethod
): Promise<Transaction> => {
  const response = await fetch(
    `${apiUrl}/api/transactions/${transactionUid}/refund`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        notes,
        amount: amount ? amount / 100 : 0,
        paymentMethod,
        processedByUid: userUid,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError(`Creating refund failed.`, errorData);
  }

  return await response.json();
};

export { addCashPayment, addCardPayment, addRefund };
