import type { EventLineItem } from "../CreateEvent/CreateEvent";
import type { Transaction } from "../types/Event";
import type { EventItem } from "../types/Event";

type SubtotalItem = EventLineItem | EventItem;

const money = (n: number) => Number(n.toFixed(2));

const calculateSubTotal = (items: SubtotalItem[]) => {
  const value = items.reduce((total, item) => {
    const qty = "count" in item ? item.count : item.quantity;

    return total + qty * (item.unitPrice ?? 0);
  }, 0);

  return money(value);
};

const calculateTaxes = (
  subTotal: number,
  discounts: number,
  taxRate: number
) => {
  const value = ((subTotal - discounts) * taxRate) / 100;
  return money(value);
};

const calculateTotal = (subTotal: number, taxes: number, discounts: number) => {
  const value = subTotal + taxes - discounts;
  return money(value);
};

const calculateTotalPayments = (transactions: Transaction[]) => {
  const value = transactions.reduce((sum, p) => sum + p.amount, 0);
  return money(value);
};

const calculateAmountDue = (total: number, totalPayments: number) => {
  const value = total - totalPayments;
  return money(value);
};

export {
  calculateAmountDue,
  calculateSubTotal,
  calculateTaxes,
  calculateTotal,
  calculateTotalPayments,
};
