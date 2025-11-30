import { type Event } from "../types/Event";
import { type AddressEntry } from "../../../types/Address";

export const mapAddressResToEvent = (
  eventDraft: Event
): { billing: AddressEntry; delivery: AddressEntry } => {
  const build = (prefix: "billing" | "delivery"): AddressEntry => ({
    uid: eventDraft[`${prefix}AddressEntryUid`],
    firstName: eventDraft[`${prefix}FirstName`],
    lastName: eventDraft[`${prefix}LastName`],
    phoneNumber: eventDraft[`${prefix}Phone`],
    email: eventDraft[`${prefix}Email`],
    addressLine1: eventDraft[`${prefix}AddressLine1`],
    addressLine2: eventDraft[`${prefix}AddressLine2`],
    city: eventDraft[`${prefix}City`],
    state: eventDraft[`${prefix}State`],
    zipCode: eventDraft[`${prefix}ZipCode`],
  });

  return {
    billing: build("billing"),
    delivery: build("delivery"),
  };
};
