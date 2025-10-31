const formatPhoneNumber = (phoneNumber?: string): string | undefined => {
  if (phoneNumber) {
    const arr = phoneNumber.split("");
    arr.splice(0, 0, "(");
    arr.splice(4, 0, ") ");
    arr.splice(8, 0, "-");
    return arr.join("");
  }
};

const splitPhoneNumber = (value?: string) => {
  if (!value) return "";
  const phoneNumber = value.replace(/[^\d]/g, "");
  const part1 = phoneNumber.slice(0, 3);
  const part2 = phoneNumber.slice(3, 6);
  const part3 = phoneNumber.slice(6, 10);

  return `${part1}-${part2}-${part3}`;
};

export { formatPhoneNumber, splitPhoneNumber };
