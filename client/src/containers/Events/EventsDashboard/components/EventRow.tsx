import { useNavigate } from "react-router";
import type { Event } from "../../types/Event";
import { useState, useEffect } from "react";
import { formatAddress } from "../../../../helpers/formatAddress";
import { format } from "date-fns";

interface EventRowProps {
  item: Event;
  isLast: boolean;
  columnTemplate: string;
  gap: number;
}

const EventRow = ({ item, isLast, columnTemplate, gap }: EventRowProps) => {
  const navigate = useNavigate();
  const paid = (): boolean => {
    const paymentsTotal = item.payments.reduce((sum, p) => sum + p.amount, 0);
    return paymentsTotal >= item.total;
  };

  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = () => setPopoverOpen(false);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      onClick={(e) => {
        if (popoverOpen) {
          e.stopPropagation();
          setPopoverOpen(false);
          return;
        }
        navigate(`${item.uid}`);
      }}
      className={`relative grid ${columnTemplate} items-center w-full gap-${gap} px-8 py-4 text-sm transition-all duration-200
    ${isLast ? "rounded-b-xl" : "border-b border-gray-200"}
    ${popoverOpen ? "" : "hover:bg-gray-50 hover:cursor-pointer"}
  `}
    >
      <p>{item.clientName}</p>
      <p>{item.eventName ?? ""}</p>
      <p>{format(new Date(item.eventStart), "Pp")}</p>
      <p>{format(new Date(item.eventEnd), "Pp")}</p>
      <p>
        {formatAddress({
          addressLine1: item.billingAddressLine1,
          addressLine2: item.billingAddressLine2,
          city: item.billingCity,
          state: item.billingState,
          zipCode: item.billingZipCode,
        })}
      </p>

      <>{paid() ? <p>Paid</p> : <p>Balance Due</p>}</>
      <p>{item.status}</p>
      <p>{item.internalNotes ?? ""}</p>
    </div>
  );
};

export default EventRow;
