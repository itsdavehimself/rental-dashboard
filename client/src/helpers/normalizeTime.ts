import * as chrono from "chrono-node";

interface NormalizedResult {
  text: string;
  wasParsed: boolean;
  hour?: number;
  minute?: number;
}

const normalizeTime = (input: string): NormalizedResult => {
  let cleanedInput = input.trim().toLowerCase();

  if (/^\d{1,2}(:\d{2})?$/.test(cleanedInput)) {
    const hourPart = parseInt(cleanedInput.split(":")[0]);

    if (hourPart === 12) {
      cleanedInput += "pm";
    } else if (hourPart > 0 && hourPart <= 7) {
      cleanedInput += "pm";
    } else if (hourPart >= 8 && hourPart <= 11) {
      cleanedInput += "am";
    }
  }

  if (/^\d+[ap]$/.test(cleanedInput)) {
    cleanedInput += "m";
  }

  const results = chrono.parse(cleanedInput, new Date(), { forwardDate: true });

  if (results.length > 0) {
    const date = results[0].date();

    const formatted = date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase()
      .replace(" ", "");

    return {
      text: formatted,
      wasParsed: true,
      hour: date.getHours(),
      minute: date.getMinutes(),
    };
  }

  return {
    text: input,
    wasParsed: false,
  };
};

export default normalizeTime;
