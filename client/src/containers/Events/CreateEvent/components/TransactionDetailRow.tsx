import type { Transaction } from "../../types/Event";
import { CreditCard, Coins } from "lucide-react";
import { formatTransactionDate } from "../../helpers/formatTransactionDate";
import { useAppSelector } from "../../../../app/hooks";

interface TransactionDetailRowProps {
  transaction: Transaction | null;
}

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const TransactionDetailRow: React.FC<TransactionDetailRowProps> = ({
  transaction,
}) => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <section className="flex justify-between items-end">
      <div className="flex flex-col">
        <p className="text-sm font-semibold">{transaction?.type}</p>
        <div className="flex gap-2 items-center">
          {transaction?.method == "Card" ? (
            <CreditCard className="h-4 w-4 text-gray-400" />
          ) : (
            <Coins className="h-4 w-4 text-gray-400" />
          )}
          <p className="text-sm text-gray-500">
            {transaction?.method === "Card"
              ? `${capitalize(transaction?.cardBrand)} •••• ${
                  transaction?.last4
                }`
              : "Cash"}
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Processed by{" "}
          {transaction?.processedBy === user?.firstName + " " + user?.lastName
            ? "You"
            : transaction?.processedBy}
        </p>
      </div>
      <div className="relative flex items-center justify-center gap-2">
        <div className="flex flex-col">
          <p
            className={`${
              transaction?.type === "Payment"
                ? "text-green-700"
                : "text-red-700"
            } text-lg font-semibold text-right`}
          >
            {transaction && transaction.amount < 0 ? "-" : "+"}$
            {transaction && Math.abs(transaction.amount).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {transaction &&
              formatTransactionDate(new Date(transaction?.occurredAt))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default TransactionDetailRow;
