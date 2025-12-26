import type { Transaction } from "../../types/Event";

import TransactionDetailRow from "./TransactionDetailRow";

interface TransactionDetailsProps {
  selectedTransaction: Transaction | null;
  relatedRefunds: Transaction[];
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({
  selectedTransaction,
  relatedRefunds,
}) => {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col">
        <p className="font-semibold mb-2">Original Transaction Details</p>
        <TransactionDetailRow transaction={selectedTransaction} />
      </div>
      {selectedTransaction && selectedTransaction.notes && (
        <div>
          <p className="text-sm font-semibold">Notes</p>
          <p className="text-sm text-gray-500">{selectedTransaction?.notes}</p>
        </div>
      )}
      {relatedRefunds.length > 0 && (
        <div className="flex flex-col mt-4">
          <p className="font-semibold mb-2">Related Refunds</p>
          <div className="flex flex-col gap-4">
            {relatedRefunds.map((r) => (
              <TransactionDetailRow key={r.uid} transaction={r} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TransactionDetails;
