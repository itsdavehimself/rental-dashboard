import type { Transaction } from "../types/Event";
const sortTransactions = (list: Transaction[]) =>
  [...list].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));

export default sortTransactions;
