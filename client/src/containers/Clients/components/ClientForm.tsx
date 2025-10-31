import { useForm, type SubmitHandler } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import PhoneInput from "../../../components/common/PhoneInput";
import SubmitButton from "../../../components/common/SubmitButton";
import React, { useEffect, useState, useRef } from "react";
import TextAreaInput from "../../../components/common/TextAreaInput";
import { toCamelCasePath } from "../../../helpers/toCamelCasePath";
import Dropdown from "../../../components/common/Dropdown";
import { STATES } from "../../../config/STATES";
import { createClient } from "../../../service/clientService";
import { useToast } from "../../../hooks/useToast";
import { handleError, type ErrorsState } from "../../../helpers/handleError";
import type { Client } from "../../../types/Client";
import type { ClientModalType } from "../Clients";
import SearchInput from "../../../components/common/SearchInput";
import { type AddressResult } from "../../../types/Address";
import { useDebounce } from "../../../hooks/useDebounce";
import { searchAddress } from "../../../service/addressService";
import AddressSearchResultRow from "../../../components/Address/AddressSearchResultRow";
import SegmentedToggle from "../../../components/common/SegmentedToggle";
import BooleanCheckbox from "../../../components/common/BooleanCheckbox";

export type ClientInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    zipCode: string;
  };
  type: "Business" | "Residential";
  businessName?: string;
  isTaxExempt: boolean;
};

interface ClientFormProps {
  errors: object | null;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  setOpenModal: React.Dispatch<React.SetStateAction<ClientModalType>>;
}

const ClientForm: React.FC<ClientFormProps> = ({
  errors,
  setErrors,
  clients,
  setClients,
  setOpenModal,
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
  } = useForm<ClientInputs>({
    defaultValues: {
      type: "Residential",
      isTaxExempt: false,
    },
  });
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();

  const state = watch("address.state");
  const type = watch("type");
  const isTaxExempt = watch("isTaxExempt");
  const ref = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addressResults, setAddressResults] = useState<AddressResult[]>([]);

  const onSubmit: SubmitHandler<ClientInputs> = async (data) => {
    try {
      setErrors(null);
      const newClient = await createClient(apiUrl, data);

      const updatedUsers = [...clients, newClient].sort((a, b) => {
        const last = a.lastName.localeCompare(b.lastName);
        return last !== 0 ? last : a.firstName.localeCompare(b.firstName);
      });

      setClients(updatedUsers);
      setOpenModal(null);
      addToast(
        "Success",
        `${newClient.firstName} ${newClient.lastName} successfully added as a client.`
      );
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const query = getValues("address.addressLine1");
      const clientList = await searchAddress(apiUrl, query);
      setAddressResults(clientList.data);
      setIsLoading(false);
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "There was a problem fetching the address list.");
      setIsLoading(false);
    }
  };

  const debouncedSearch = useDebounce(handleSearch, 750);

  useEffect(() => {
    clearErrors();

    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
      Object.entries(errors).forEach(([fieldName, errorMessages]) => {
        const fieldKey = toCamelCasePath(fieldName) as keyof ClientInputs;

        if (Array.isArray(errorMessages) && errorMessages.length > 0) {
          setError(fieldKey, {
            type: "server",
            message: errorMessages[0],
          });
        }
      });
    }
  }, [errors, setError, clearErrors]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown && !ref.current?.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (formErrors.address?.state) {
      if (state && formErrors.address.state) {
        clearErrors("address.state");
      }
    }
  }, [state, formErrors.address?.state, clearErrors]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center px-8 pt-4 gap-4"
    >
      <div className="flex justify-center items-center">
        <SegmentedToggle
          option={type}
          setOption={(val) =>
            setValue(
              "type",
              typeof val === "function" ? val(getValues("type")) : val
            )
          }
          options={["Residential", "Business"]}
          labels={["Residential", "Business"]}
        />
      </div>
      {type === "Business" && (
        <div className="flex flex-col gap-4">
          <h4 className="font-semibold -mb-1">Business Info</h4>
          <StyledInput
            label="Business Name"
            placeholder="Table Tops, LLC"
            register={register("businessName")}
          />
          <BooleanCheckbox
            label="Tax Exempt"
            checked={isTaxExempt}
            onChange={(val) => setValue("isTaxExempt", val)}
          />
          <hr className="border-gray-200 mt-2"></hr>
        </div>
      )}
      <div className="flex flex-col gap-4">
        <h4 className="font-semibold -mb-1">Primary Contact</h4>
        <div className="grid grid-cols-2 gap-4 w-172">
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
            register={register("phoneNumber")}
            error={formErrors.phoneNumber?.message}
          />
        </div>
        <hr className="border-gray-200 mt-2"></hr>
      </div>
      <div className="flex flex-col gap-4">
        <h4 className="font-semibold -mb-1">Primary Address</h4>
        <SearchInput
          label="Address Line 1"
          placeholder="123 Bouncehouse Ln"
          register={register("address.addressLine1")}
          error={formErrors.address?.addressLine1?.message}
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
                addressLine1: "address.addressLine1",
                city: "address.city",
                state: "address.state",
                zipCode: "address.zipCode",
              }}
            />
          )}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        <StyledInput
          label="Address Line 2"
          placeholder="Suite 7"
          register={register("address.addressLine2")}
          error={formErrors.address?.addressLine2?.message}
          optional={true}
        />
        <div className="grid grid-cols-[1fr_5rem_.5fr] gap-4">
          <StyledInput
            label="City"
            placeholder="Canopyside"
            register={register("address.city")}
            error={formErrors.address?.city?.message}
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
            onChange={(val) => setValue("address.state", val as string)}
            error={formErrors.address?.state?.message}
          />
          <StyledInput
            label="Zip Code"
            placeholder="60089"
            register={register("address.zipCode")}
            error={formErrors.address?.zipCode?.message}
          />
        </div>
      </div>
      <TextAreaInput
        label="Notes"
        register={register("notes")}
        optional={true}
      />
      <div className="self-center w-1/4">
        <SubmitButton label="Add" />
      </div>
    </form>
  );
};

export default ClientForm;
