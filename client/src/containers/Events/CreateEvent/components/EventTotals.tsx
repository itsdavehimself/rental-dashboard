import ActionButton from "../../../../components/common/ActionButton";
import { DollarSign, HandCoins } from "lucide-react";

const EventTotals: React.FC = () => {
  return (
    <div className="flex flex-col flex-grow gap-6 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
      <div className="flex justify-between">
        <h4 className="font-semibold text-lg">Totals & Payment</h4>
        <div className="flex items-center justify-center px-3 py-1 text-xs rounded-2xl bg-yellow-200 text-yellow-800 font-semibold">
          Payment Due
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-[1fr_.4fr] text-sm">
          <h6 className="font-semibold">Subtotal</h6>
          <p className="text-right">$0.00</p>
        </div>
        <button className="text-left text-xs font-semibold text-gray-500 hover:text-primary hover:cursor-pointer transition-all duration-200">
          Add a discount/coupon
        </button>
        <div className="grid grid-cols-[1fr_.4fr] text-sm">
          <h6 className="font-semibold">Discounts</h6>
          <p className="text-right">$0.00</p>
        </div>
        <div className="grid grid-cols-[1fr_.4fr] text-sm">
          <h6 className="font-semibold">Taxes</h6>
          <p className="text-right">$0.00</p>
        </div>
        <div className="grid grid-cols-[1fr_.4fr]">
          <h5 className="font-semibold">Total</h5>
          <p className="font-semibold text-right">$0.00</p>
        </div>
        <div className="grid grid-cols-[1fr_.4fr] text-sm">
          <h6 className="font-semibold">Payments/Deposits</h6>
          <p className="text-right">$0.00</p>
        </div>
        <div className="grid grid-cols-[1fr_.4fr]">
          <h5 className="font-semibold">Amount Due</h5>
          <p className="font-semibold text-right">$0.00</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center h-full w-full items-center">
        <ActionButton
          label="New Deposit"
          icon={HandCoins}
          style="outline"
          onClick={() => "deposit"}
          full={true}
        />
        <ActionButton
          label="New Payment"
          icon={DollarSign}
          style="filled"
          onClick={() => "payment"}
          full={true}
        />
      </div>
    </div>
  );
};

export default EventTotals;
