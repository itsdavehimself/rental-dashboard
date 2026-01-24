export const formatToUTC = (
  date: Date | null,
  timeStr: string | null
): string | null => {
  if (!date || !timeStr) return null;

  const [time, meridiem] = timeStr
    .trim()
    .toLowerCase()
    .split(/(am|pm)/);
  const [rawHours, rawMinutes = "0"] = time.split(":");

  let hours = Number(rawHours);
  const minutes = Number(rawMinutes);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  const d = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hours,
    minutes,
    0,
    0
  );

  return d.toISOString();
};

export default formatToUTC;
