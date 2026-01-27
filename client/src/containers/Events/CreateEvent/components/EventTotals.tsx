import ActionButton from "../../../../components/common/ActionButton";
import { DollarSign } from "lucide-react";
import { useCreateEvent } from "../../hooks/useCreateEvent";
import ChipTag from "../../../../components/common/ChipTag";
import { paymentStatus } from "../../helpers/paymentStatus";
import { saveEvent } from "../../services/eventService";
import { useNavigate } from "react-router";
import { useFormContext } from "react-hook-form";
import type { CreateEventInputs } from "../CreateEvent";
import formatToUTC from "../../../../helpers/formatToUTC";
import { useBilling } from "../../hooks/useBilling";

const EventTotals: React.FC = () => {
  const {
    setOpenModal,
    eventUid,
    setEventUid,
    client,
    eventBilling,
    eventDelivery,
  } = useCreateEvent();

  const {
    selectedItems,
    subTotal,
    total,
    taxes,
    totalPayments,
    amountDue,
    discounts,
    transactions,
  } = useBilling();

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const status = paymentStatus(transactions, total);
  const navigate = useNavigate();
  const { watch, getValues } = useFormContext<CreateEventInputs>();

  const startDate = watch("startDate");
  const startTime = watch("startTime");
  const endDate = watch("endDate");
  const endTime = watch("endTime");

  const datesSelected = !!(startDate && startTime && endDate && endTime);

  const formattedStartDateTime = formatToUTC(startDate, startTime);
  const formattedEndDateTime = formatToUTC(endDate, endTime);

  const backgroundSaveEvent = async () => {
    if (
      !client ||
      !eventBilling ||
      !eventDelivery ||
      !datesSelected ||
      !formattedStartDateTime ||
      !formattedEndDateTime
    )
      return;

    try {
      const items = selectedItems.map((i) => ({
        inventoryItemUid: i.uid,
        quantity: i.count,
      }));

      const uids = {
        clientUid: client.uid,
        billingUid: eventBilling.uid,
        deliveryUid: eventDelivery.uid,
      };

      const data = getValues();

      if (!eventUid) {
        const event = await saveEvent(
          apiUrl,
          data,
          formattedStartDateTime,
          formattedEndDateTime,
          items,
          uids,
          eventUid,
          "draft",
        );
        setEventUid(event.uid);
        navigate(`?clientId=${client.uid}&eventId=${event.uid}`, {
          replace: true,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col flex-grow gap-6 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden w-full">
      <div className="flex justify-between">
        <h4 className="font-semibold text-lg">Totals & Payment</h4>
        <div>
          <ChipTag label={status.label} color={status.color} />
        </div>
      </div>
      <div className="flex flex-col 3xl:gap-3 4xl:gap-8">
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
      <div className="flex flex-col gap-4 justify-center 4xl:h-full 4xl:w-full items-center">
        <ActionButton
          label="Payments"
          icon={DollarSign}
          style={amountDue === 0 ? "outline" : "filled"}
          onClick={() => {
            backgroundSaveEvent();
            setOpenModal("addPayment");
          }}
          full={true}
          disabled={amountDue === undefined}
        />
      </div>
    </div>
  );
};

export default EventTotals;
