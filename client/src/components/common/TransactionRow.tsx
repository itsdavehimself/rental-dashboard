import type { Transaction } from "../../containers/Events/types/Event";
import { formatTransactionDate } from "../../containers/Events/helpers/formatTransactionDate";
import { useAppSelector } from "../../app/hooks";
import {
  EllipsisVertical,
  Coins,
  CreditCard,
  BanknoteArrowDown,
  NotebookText,
} from "lucide-react";
import React, { useState, useRef } from "react";
import PopOver from "./PopOver";
import { useBilling } from "../../containers/Events/hooks/useBilling";

interface TransactionRowProps {
  transaction: Transaction;
  setView: React.Dispatch<
    React.SetStateAction<"add" | "view" | "refund" | "details" | null>
  >;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
}

const capitalize = (s?: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  setView,
  setSelectedTransaction,
}) => {
  const user = useAppSelector((state) => state.user.user);
  const { transactions } = useBilling();

  const totalRefunded = transactions
    .filter((t) => t.relatedTransactionUid === transaction.uid)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const isFullyRefunded = totalRefunded >= transaction.amount;

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [popOverOpen, setPopOverOpen] = useState<boolean>(false);

  return (
    <div className="flex justify-between items-end">
      <div className="flex flex-col">
        <p className="text-sm font-semibold">{transaction.type}</p>
        <div className="flex gap-2 items-center">
          {transaction.method == "Card" ? (
            <CreditCard className="h-4 w-4 text-gray-400" />
          ) : (
            <Coins className="h-4 w-4 text-gray-400" />
          )}
          <p className="text-sm text-gray-500">
            {transaction.method === "Card"
              ? `${capitalize(transaction.cardBrand)} •••• ${transaction.last4}`
              : "Cash"}
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Processed by{" "}
          {transaction.processedBy === user?.firstName + " " + user?.lastName
            ? "You"
            : transaction.processedBy}
        </p>
      </div>

      {/* Removed the ref from this div */}
      <div className="relative flex items-center justify-center gap-2">
        <div className="flex flex-col">
          <p
            className={`${
              transaction.type === "Payment" ? "text-green-700" : "text-red-700"
            } text-lg font-semibold text-right`}
          >
            {transaction.amount < 0 ? "-" : "+"}$
            {Math.abs(transaction.amount).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">
            {formatTransactionDate(new Date(transaction.occurredAt))}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!buttonRef.current) return;
            setAnchorRect(buttonRef.current.getBoundingClientRect());
            setPopOverOpen(!popOverOpen);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          ref={buttonRef}
          className="p-1 text-gray-400 hover:text-primary transition-all duration-200 hover:cursor-pointer"
        >
          <EllipsisVertical className="h-4 w-4" />
        </button>
        {popOverOpen && anchorRect && (
          <PopOver
            anchorRect={anchorRect}
            onClose={() => setPopOverOpen(false)}
            buttons={[
              {
                icon: NotebookText,
                label: "View Details",
                onClick: () => {
                  setSelectedTransaction(transaction);
                  setView("details");
                },
              },
              ...(transaction.type !== "Refund" && !isFullyRefunded
                ? [
                    {
                      icon: BanknoteArrowDown,
                      label:
                        transaction.method === "Cash"
                          ? "Record Cash Refund"
                          : "Refund",
                      onClick: () => {
                        setSelectedTransaction(transaction);
                        setView("refund");
                      },
                    },
                  ]
                : []),
            ]}
          />
        )}
      </div>
    </div>
  );
};

export default TransactionRow;
