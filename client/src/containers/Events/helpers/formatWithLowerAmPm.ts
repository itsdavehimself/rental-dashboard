import { formatDate, parseISO, getYear } from "date-fns";

const formatLowerAmPmShorthand = (date: string) => {
  const s = formatDate(parseISO(date), "MM/dd/yy h:mma");
  return s.slice(0, -2) + s.slice(-2).toLowerCase();
};

const formatLowerAmPm = (date: string) => {
  return formatDate(parseISO(date), "MMM dd, yyyy h:mma").replace(
    /am|pm/i,
    (m) => m.toLowerCase()
  );
};

const formatEventDateTime = (dateString: string) => {
  const dateObj = parseISO(dateString);
  const currentYear = new Date().getFullYear(); // 2026
  const eventYear = getYear(dateObj);

  // Format: "Sat, Nov 15" or "Sat, Nov 15, 2025"
  const dateToken =
    eventYear === currentYear ? "EEE, MMM dd" : "EEE, MMM dd, yyyy";

  return {
    date: formatDate(dateObj, dateToken),
    time: formatDate(dateObj, "h:mm a").toLowerCase(),
  };
};

export { formatLowerAmPmShorthand, formatLowerAmPm, formatEventDateTime };
