import ActionButton from "../../../../components/common/ActionButton";
import { DollarSign } from "lucide-react";
import ChipTag from "../../../../components/common/ChipTag";
import { paymentStatus } from "../../helpers/paymentStatus";
import { useBilling } from "../../hooks/useBilling";
import { useAppDispatch } from "../../../../app/hooks";
import { openModal } from "../../../../app/slices/uiSlice";

const EventDetailsTotals: React.FC = () => {
  const {
    transactions,
    total,
    totalPayments,
    subTotal,
    amountDue,
    taxes,
    discounts,
  } = useBilling();

  const dispatch = useAppDispatch();

  const status = paymentStatus(transactions ?? [], total);

  return (
    <section className="flex flex-col flex-grow gap-6 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
      <div className="flex justify-between">
        <h4 className="font-semibold text-lg">Totals & Payment</h4>
        <div>
          <ChipTag label={status.label} color={status.color} />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-[1fr_.4fr] text-sm">
          <h6 className="font-semibold">Subtotal</h6>
          <p className="text-right">${subTotal.toFixed(2)}</p>
        </div>
        {/* <button className="text-left text-xs font-semibold text-gray-500 hover:text-primary hover:cursor-pointer transition-all duration-200">
          Add a discount/coupon
        </button> */}
        <div className="grid grid-cols-[1fr_.4fr] text-sm">
          <h6 className="font-semibold">Discounts</h6>
          <p className="text-right">${discounts.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-[1fr_.4fr] text-sm">
          <h6 className="font-semibold">Tax</h6>
          <p className="text-right">${taxes.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-[1fr_.4fr] text-sm">
          <h5 className="font-semibold">Total</h5>
          <p className="font-semibold text-right">${total.toFixed(2)}</p>
        </div>
        <hr className="text-gray-200"></hr>
        <div className="grid grid-cols-[1fr_.4fr] text-sm">
          <h6 className="font-semibold">Payments/Deposits</h6>
          <p className="text-right">${totalPayments.toFixed(2)}</p>
        </div>
        <div className="grid grid-cols-[1fr_.4fr]">
          <h5 className="font-semibold">Amount Due</h5>
          <p className="font-semibold text-right">${amountDue.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center h-full w-full items-center">
        <ActionButton
          label="Payments"
          icon={DollarSign}
          style={amountDue === 0 ? "outline" : "filled"}
          onClick={() => dispatch(openModal("payments"))}
          full={true}
          disabled={amountDue === undefined}
        />
      </div>
    </section>
  );
};

export default EventDetailsTotals;
