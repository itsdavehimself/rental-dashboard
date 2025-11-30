import { useNavigate } from "react-router";
import type { Event } from "../../types/Event";
import { useState, useEffect } from "react";
import { formatAddress } from "../../../../helpers/formatAddress";
import { format } from "date-fns";
import ChipTag from "../../../../components/common/ChipTag";
import TAG_COLOR_MAP from "../../../../config/TAG_COLOR_MAP";
import { paymentStatus } from "../../helpers/paymentStatus";

interface EventRowProps {
  item: Event;
  isLast: boolean;
  columnTemplate: string;
  gap: number;
}

type TagColor = keyof typeof TAG_COLOR_MAP;

const statusMap: Record<string, { label: string; color: TagColor }> = {
  Draft: { label: "Draft", color: "gray" },
  Confirmed: { label: "Confirmed", color: "blue" },
  Scheduled: { label: "Scheduled", color: "amber" },
  Completed: { label: "Completed", color: "green" },
  Cancelled: { label: "Cancelled", color: "red" },
};

const EventRow = ({ item, isLast, columnTemplate, gap }: EventRowProps) => {
  const navigate = useNavigate();

  const status = paymentStatus(item.payments, item.total);

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
        if (item.status === "Draft") {
          navigate(
            `/events/create?clientId=${item.clientUid}&eventId=${item.uid}`
          );
        } else {
          navigate(`${item.uid}`);
        }
      }}
      className={`relative grid ${columnTemplate} items-center w-full gap-${gap} px-8 py-4 text-sm transition-all duration-200
    ${isLast ? "rounded-b-xl" : "border-b border-gray-200"}
    ${popoverOpen ? "" : "hover:bg-gray-50 hover:cursor-pointer"}
  `}
    >
      <p>
        {item.clientFirstName} {item.clientLastName}
      </p>
      <p>{item.eventName ?? ""}</p>
      <p>{format(new Date(item.eventStart), "Pp")}</p>
      <p>{format(new Date(item.eventEnd), "Pp")}</p>
      <p>
        {formatAddress({
          addressLine1: item.deliveryAddressLine1,
          addressLine2: item.deliveryAddressLine2,
          city: item.deliveryCity,
          state: item.deliveryState,
          zipCode: item.deliveryZipCode,
        })}
      </p>

      <>
        <ChipTag label={status.label} color={status.color} />
      </>
      <ChipTag
        label={statusMap[item.status].label}
        color={statusMap[item.status].color}
      />
      <p>{item.internalNotes ?? ""}</p>
    </div>
  );
};

export default EventRow;
