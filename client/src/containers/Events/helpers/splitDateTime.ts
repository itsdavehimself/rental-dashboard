import { formatDate } from "date-fns";

const splitDateTime = (date: Date): { date: Date; time: string } => ({
  date: new Date(date),
  time: formatDate(date, "h:mmaa").toLowerCase(),
});

export default splitDateTime;
