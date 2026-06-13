import { useState } from "react";
import type { InventoryItemDetails } from "../../types/InventoryItem";

interface ItemLedgerProps {
  item: InventoryItemDetails;
}

// Helper to map the C# enum integer back to a human-readable string
const getReasonLabel = (reasonVal: number) => {
  switch (reasonVal) {
    case 0:
      return "Broken / Damaged";
    case 1:
      return "Lost";
    case 2:
      return "Sold";
    case 3:
      return "Stolen";
    default:
      return "Unknown";
  }
};

const ItemLedger: React.FC<ItemLedgerProps> = ({ item }) => {
  const [activeTab, setActiveTab] = useState<"PURCHASES" | "RETIREMENTS">(
    "PURCHASES",
  );

  // Fallbacks if data isn't loaded yet
  const purchases = item?.purchases || [];
  const retirements = item?.retirements || [];

  const totalPurchased = purchases.reduce(
    (sum: number, p) => sum + p.quantityPurchased,
    0,
  );
  const totalRetired = retirements.reduce(
    (sum: number, r) => sum + r.quantityRetired,
    0,
  );
  const currentlyAvailable = totalPurchased - totalRetired;

  // Sort descending (newest first)
  const sortedPurchases = [...purchases].sort(
    (a, b) =>
      new Date(b.datePurchased).getTime() - new Date(a.datePurchased).getTime(),
  );

  const sortedRetirements = [...retirements].sort(
    (a, b) =>
      new Date(b.dateRetired).getTime() - new Date(a.dateRetired).getTime(),
  );

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col h-full">
      {/* Stock Summary */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
          <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Total In
          </span>
          <span className="text-xl font-bold text-gray-800">
            {totalPurchased}
          </span>
        </div>
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-xl">
          <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">
            Retired
          </span>
          <span className="text-xl font-bold text-red-600">{totalRetired}</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl ring-1 ring-blue-100">
          <span className="text-xs text-blue-600 uppercase font-bold tracking-wider">
            Current
          </span>
          <span className="text-2xl font-bold text-blue-700">
            {currentlyAvailable}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("PURCHASES")}
          className={`pb-2 text-sm font-semibold transition-colors ${activeTab === "PURCHASES" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"} hover:cursor-pointer`}
        >
          Purchase History
        </button>
        <button
          onClick={() => setActiveTab("RETIREMENTS")}
          className={`pb-2 text-sm font-semibold transition-colors ${activeTab === "RETIREMENTS" ? "text-primary border-b-2 border-primary" : "text-gray-400 hover:text-gray-600"} hover:cursor-pointer`}
        >
          Retirements
        </button>
      </div>

      {/* Ledger List */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto pr-2">
        {activeTab === "PURCHASES" && sortedPurchases.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-8">
            No purchase history found.
          </p>
        )}
        {activeTab === "PURCHASES" &&
          sortedPurchases.map((p, i) => (
            <div
              key={p.id || i}
              className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex flex-col">
                <span className="text-sm text-gray-800 font-semibold">
                  {new Date(p.datePurchased).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-500">
                  {p.vendorName || "Unknown Vendor"}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-green-600">
                  +{p.quantityPurchased}
                </span>
                <span className="text-xs text-gray-400">
                  ${p.unitCost.toFixed(2)}/ea
                </span>
              </div>
            </div>
          ))}

        {activeTab === "RETIREMENTS" && sortedRetirements.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-8">
            No retirements logged.
          </p>
        )}
        {activeTab === "RETIREMENTS" &&
          sortedRetirements.map((r, i) => (
            <div
              key={r.id || i}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50"
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">
                  {new Date(r.dateRetired).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-500">
                  Reason: {getReasonLabel(r.reason)}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-red-600">
                  -{r.quantityRetired}
                </span>
                {r.notes && (
                  <span className="text-xs text-gray-400 italic mt-0.5">
                    "{r.notes}"
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ItemLedger;
