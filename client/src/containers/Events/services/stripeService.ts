import { CustomError } from "../../../types/CustomError";

const createPaymentIntent = async (
  apiUrl: string,
  amount: number,
  email: string
): Promise<string> => {
  const response = await fetch(`${apiUrl}/api/stripe/create-payment-intent`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      email,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new CustomError("Creating payment intent failed.", errorData);
  }

  const data = await response.json();
  return data.client_secret;
};

export { createPaymentIntent };
