export const formatPhoneNumber = (phoneNumber?: string): string | undefined => {
  if (phoneNumber) {
    const arr = phoneNumber.split("");
    arr.splice(0, 0, "(");
    arr.splice(4, 0, ") ");
    arr.splice(8, 0, "-");
    return arr.join("");
  }
};
