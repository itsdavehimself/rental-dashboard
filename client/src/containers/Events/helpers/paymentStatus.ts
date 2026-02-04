import type { Transaction } from "../types/Event";
import TAG_COLOR_MAP from "../../../config/TAG_COLOR_MAP";

type TagColor = keyof typeof TAG_COLOR_MAP;

export const paymentStatus = (transactions: Transaction[], total: number) => {
  const transactionsTotal = transactions.reduce((sum, p) => sum + p.amount, 0);

  const roundedTransactions = Math.round(transactionsTotal * 100) / 100;
  const roundedTotal = Math.round(total * 100) / 100;

  if (roundedTotal === 0 && roundedTransactions === 0) {
    return { label: "No Balance", color: "gray" as TagColor };
  }

  if (roundedTransactions === roundedTotal) {
    return { label: "Paid", color: "green" as TagColor };
  }

  if (roundedTransactions > roundedTotal) {
    return { label: "Overpaid", color: "blue" as TagColor };
  }

  return { label: "Balance Due", color: "yellow" as TagColor };
};
