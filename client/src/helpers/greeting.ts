export const greeting = () => {
  const now = new Date(Date.now());
  const hours = now.getHours();

  if (hours > 0 && hours < 12) return "Good morning";
  else if (hours > 12 && hours < 18) return "Good afternoon";
  else return "Good evening";
};
