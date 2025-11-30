import { formatDate } from "date-fns";

const splitDateTime = (date: Date): { date: Date; time: string } => {
  return {
    date: new Date(date),
    time: formatDate(date, "h:mm aa"),
  };
};

export default splitDateTime;
