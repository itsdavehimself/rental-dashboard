import { formatDate, isThisYear } from "date-fns";

export const formatTransactionDate = (date: Date) => {
  return isThisYear(date)
    ? formatDate(date, "MMM d · h:mm a")
    : formatDate(date, "MMM d, yyyy  · h:mm a");
};
