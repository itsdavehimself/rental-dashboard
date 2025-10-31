import SearchInput from "../../../../components/common/SearchInput";
import StyledInput from "../../../../components/common/StyledInput";
import Dropdown from "../../../../components/common/Dropdown";
import { STATES } from "../../../../config/STATES";
import AddressSearchResultRow from "../../../../components/Address/AddressSearchResultRow";
import { useForm, type SubmitHandler } from "react-hook-form";
import SubmitButton from "../../../../components/common/SubmitButton";
import React, { useEffect, useState, useRef } from "react";
import { useToast } from "../../../../hooks/useToast";
import { handleError, type ErrorsState } from "../../../../helpers/handleError";
import type { AddressResult } from "../../../../types/Address";
import { useDebounce } from "../../../../hooks/useDebounce";
import { searchAddress } from "../../../../service/addressService";
import PhoneInput from "../../../../components/common/PhoneInput";
import { splitPhoneNumber } from "../../../../helpers/formatPhoneNumber";
import BooleanCheckbox from "../../../../components/common/BooleanCheckbox";
import {
  createAddressEntry,
  updateAddressEntry,
} from "../../../../service/clientService";
import { useCreateEvent } from "../../../../context/useCreateEvent";

export type AddressInputs = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  isPrimary: boolean;
};

interface AddressBookForm {
  type: "billing" | "delivery";
  setView: React.Dispatch<
    React.SetStateAction<"default" | "edit" | "add" | "delete">
  >;
  addressEntryUid: string | null;
  mode: "add" | "edit";
}

const AddressBookForm: React.FC<AddressBookForm> = ({
  type,
  setView,
  addressEntryUid,
  mode,
}) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
    formState: { errors: formErrors },
  } = useForm<AddressInputs>();
  const {
    client,
    setClient,
    eventBilling,
    eventDelivery,
    setEventBilling,
    setEventDelivery,
  } = useCreateEvent();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();

  const state = watch("state");
  const ref = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addressResults, setAddressResults] = useState<AddressResult[]>([]);
  const [errors, setErrors] = useState<ErrorsState>(null);

  const key = type === "billing" ? "billingAddresses" : "deliveryAddresses";
  const selectedAddress =
    client && client[key]?.find((a) => a.uid === addressEntryUid);

  const isPrimary = watch("isPrimary");

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const query = getValues("addressLine1");
      const clientList = await searchAddress(apiUrl, query);
      setAddressResults(clientList.data);
      setIsLoading(false);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching the address list.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!client) return;

    if (mode === "add") {
      if (client.firstName) setValue("firstName", client.firstName);
      if (client.lastName) setValue("lastName", client.lastName);
      if (client.phoneNumber)
        setValue("phoneNumber", splitPhoneNumber(client.phoneNumber));
      if (client.email) setValue("email", client.email);
    }

    if (mode === "edit") {
      if (!selectedAddress) return;

      setValue("firstName", selectedAddress.firstName || "");
      setValue("lastName", selectedAddress.lastName || "");
      setValue(
        "phoneNumber",
        splitPhoneNumber(selectedAddress.phoneNumber || "")
      );
      setValue("email", selectedAddress.email || "");
      setValue("addressLine1", selectedAddress.addressLine1 || "");
      setValue("addressLine2", selectedAddress.addressLine2 || "");
      setValue("city", selectedAddress.city || "");
      setValue("state", selectedAddress.state || "");
      setValue("zipCode", selectedAddress.zipCode || "");
      setValue("isPrimary", selectedAddress.isPrimary || false);
    }
  }, [mode, client, addressEntryUid, type, setValue, selectedAddress]);

  const debouncedSearch = useDebounce(handleSearch, 750);

  const onSubmit: SubmitHandler<AddressInputs> = async (data) => {
    if (!client) return;

    try {
      setErrors(null);
      const isEdit = mode === "edit" && addressEntryUid !== null;

      const apiCall = isEdit
        ? updateAddressEntry(addressEntryUid!, apiUrl, data, type)
        : createAddressEntry(client.uid, apiUrl, data, type);

      const addressResponse = await apiCall;

      setClient((prev) => {
        if (!prev) return prev;

        const key =
          type === "billing" ? "billingAddresses" : "deliveryAddresses";
        let updatedAddresses = [...prev[key]];

        if (data.isPrimary) {
          updatedAddresses = updatedAddresses.map((addr) => ({
            ...addr,
            isPrimary: false,
          }));
        }

        if (isEdit) {
          updatedAddresses = updatedAddresses.map((a) =>
            a.uid === addressResponse.uid ? { ...a, ...addressResponse } : a
          );
        } else {
          updatedAddresses.push(addressResponse);
        }

        const sorted = updatedAddresses.sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return a.addressLine1.localeCompare(b.addressLine1);
        });

        const addressType = type === "billing" ? eventBilling : eventDelivery;
        const setActionType =
          type === "billing" ? setEventBilling : setEventDelivery;

        if (addressType?.uid === selectedAddress?.uid) {
          setActionType(addressResponse);
        }

        return { ...prev, [key]: sorted };
      });

      setView("default");
      addToast(
        "Success",
        `${type.charAt(0).toUpperCase() + type.slice(1)} address successfully ${
          isEdit ? "updated" : "added"
        }.`
      );
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 px-6 pt-4"
    >
      <div className="flex flex-col gap-2">
        <StyledInput
          label="First Name"
          placeholder="Becky"
          register={register("firstName")}
          error={formErrors.firstName?.message}
        />
        <StyledInput
          label="Last Name"
          placeholder="Bouncehouse"
          register={register("lastName")}
          error={formErrors.lastName?.message}
        />
        <StyledInput
          label="Email"
          placeholder="beckybouncehouse@adrentals.com"
          register={register("email")}
          error={formErrors.email?.message}
        />
        <PhoneInput
          label="Phone Number"
          value={
            mode === "add"
              ? splitPhoneNumber(client?.phoneNumber)
              : splitPhoneNumber(selectedAddress?.phoneNumber)
          }
          register={register("phoneNumber")}
          error={formErrors.phoneNumber?.message}
        />
        <SearchInput
          label="Address Line 1"
          placeholder="123 Bouncehouse Ln"
          register={register("addressLine1")}
          error={formErrors.addressLine1?.message}
          debouncedSearch={debouncedSearch}
          results={addressResults}
          setResults={setAddressResults}
          renderResult={(address) => (
            <AddressSearchResultRow
              key={address.id}
              address={address}
              setValue={setValue}
              setResults={setAddressResults}
              fieldMap={{
                addressLine1: "addressLine1",
                city: "city",
                state: "state",
                zipCode: "zipCode",
              }}
            />
          )}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <StyledInput
          label="Address Line 2"
          placeholder="Suite 7"
          register={register("addressLine2")}
          error={formErrors.addressLine2?.message}
          optional={true}
        />
        <div className="grid grid-cols-[1fr_5rem_.5fr] gap-4">
          <StyledInput
            label="City"
            placeholder="Canopyside"
            register={register("city")}
            error={formErrors.city?.message}
          />
          <Dropdown
            ref={ref}
            label="State"
            value={state}
            options={STATES}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            selectedLabel={
              STATES.find((s) => s.value === state)?.label ?? "State"
            }
            onChange={(val) => setValue("state", val as string)}
            error={formErrors.state?.message}
          />
          <StyledInput
            label="Zip Code"
            placeholder="60089"
            register={register("zipCode")}
            error={formErrors.zipCode?.message}
          />
          <BooleanCheckbox
            label="Set as Primary"
            checked={isPrimary}
            onChange={(val) => setValue("isPrimary", val)}
          />
        </div>
      </div>
      <div className="self-end">
        <SubmitButton label={mode === "add" ? "Add" : "Save"} />
      </div>
    </form>
  );
};

export default AddressBookForm;
