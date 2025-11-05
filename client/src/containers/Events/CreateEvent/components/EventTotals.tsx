import ActionButton from "../../../../components/common/ActionButton";
import { DollarSign } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCreateEvent } from "../../hooks/useCreateEvent";
import { getTaxRate } from "../../../../service/taxService";
import { handleError } from "../../../../helpers/handleError";
import { useToast } from "../../../../hooks/useToast";

const EventTotals: React.FC = () => {
  const { selectedItems, eventDelivery } = useCreateEvent();
  const [taxRate, setTaxRate] = useState<number>(0);
  const [zipCode, setZipCode] = useState(eventDelivery?.zipCode);

  const { addToast } = useToast();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const subTotal = useMemo(() => {
    return selectedItems.reduce(
      (total, item) => total + item.count * (item.unitPrice ?? 0),
      0
    );
  }, [selectedItems]);

  const discounts = 0;

  const fetchTaxRate = async () => {
    if (zipCode)
      try {
        const taxRes = await getTaxRate(apiUrl, zipCode);
        setTaxRate(taxRes.taxRate);
      } catch (err) {
        handleError(err, setErrors);
        addToast("Error", "There was a problem getting the tax rate.");
      }
  };

  useEffect(() => {
    fetchTaxRate();
  }, [zipCode]);

  useEffect(() => {
    setZipCode(eventDelivery?.zipCode);
  }, [eventDelivery]);

  const taxes = useMemo(() => {
    return ((subTotal - discounts) * taxRate) / 100;
  }, [subTotal, discounts, taxRate]);

  const total = useMemo(() => {
    return subTotal + taxes - discounts;
  }, [subTotal, taxes, discounts]);

  const payments = 0;

  const amountDue = useMemo(() => {
    return total - payments;
  }, [total, payments]);

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
          <p className="text-right">${subTotal.toFixed(2)}</p>
        </div>
        <button className="text-left text-xs font-semibold text-gray-500 hover:text-primary hover:cursor-pointer transition-all duration-200">
          Add a discount/coupon
        </button>
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
          <p className="text-right">$0.00</p>
        </div>
        <div className="grid grid-cols-[1fr_.4fr]">
          <h5 className="font-semibold">Amount Due</h5>
          <p className="font-semibold text-right">${amountDue.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex flex-col gap-4 justify-center h-full w-full items-center">
        <ActionButton
          label="Add Payment"
          icon={DollarSign}
          style="filled"
          onClick={() => console.log("payment")}
          full={true}
        />
      </div>
    </div>
  );
};

export default EventTotals;
