export const formatPhoneNumber = (phoneNumber?: string): string | undefined => {
  if (phoneNumber) {
    const arr = phoneNumber.split("");
    arr.splice(3, 0, "-");
    arr.splice(7, 0, "-");
    return arr.join("");
  }
};
