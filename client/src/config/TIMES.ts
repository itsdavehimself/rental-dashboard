export const timeSlots = () =>
  Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? "00" : "30";
    const suffix = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    const time = `${hour12}:${minutes} ${suffix}`;
    return {
      label: time,
      value: time,
    };
  });
