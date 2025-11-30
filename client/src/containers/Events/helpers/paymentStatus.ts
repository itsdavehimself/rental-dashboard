import type { Payment } from "../types/Event";
import TAG_COLOR_MAP from "../../../config/TAG_COLOR_MAP";

type TagColor = keyof typeof TAG_COLOR_MAP;

export const paymentStatus = (payments: Payment[], total: number) => {
  const paymentsTotal = payments.reduce((sum, p) => sum + p.amount, 0);

  if (total === 0 && paymentsTotal === 0) {
    return { label: "No Balance", color: "gray" as TagColor };
  }

  if (paymentsTotal === total) {
    return { label: "Paid", color: "green" as TagColor };
  }

  if (paymentsTotal > total) {
    return { label: "Overpaid", color: "blue" as TagColor };
  }

  return { label: "Balance Due", color: "yellow" as TagColor };
};
