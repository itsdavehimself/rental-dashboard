import { useForm, type SubmitHandler } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import PhoneInput from "../../../components/common/PhoneInput";
import SubmitButton from "../../../components/common/SubmitButton";
import React, { useEffect, useState, useRef } from "react";
import TextAreaInput from "../../../components/common/TextAreaInput";
import { toCamelCasePath } from "../../../helpers/toCamelCastPath";
import Dropdown from "../../../components/common/Dropdown";
import { STATES } from "../../../config/STATES";
import { createResidentialClient } from "../../../service/clientService";
import { useToast } from "../../../hooks/useToast";
import { handleError, type ErrorsState } from "../../../helpers/handleError";
import type { ResidentialClient } from "../../../types/Client";
import type { ClientModalType } from "../Clients";

export type ResidentialClientInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  notes?: string;
  address: {
    street: string;
    unit?: string;
    city: string;
    state: string;
    zipCode: string;
  };
};

interface ResidentialClientFormProps {
  errors: object | null;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
  residentialClients: ResidentialClient[];
  setResidentialClients: React.Dispatch<
    React.SetStateAction<ResidentialClient[]>
  >;
  setOpenModal: React.Dispatch<React.SetStateAction<ClientModalType>>;
}

const ResidentialClientForm: React.FC<ResidentialClientFormProps> = ({
  errors,
  setErrors,
  residentialClients,
  setResidentialClients,
  setOpenModal,
}) => {
  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors: formErrors },
  } = useForm<ResidentialClientInputs>();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();

  const state = watch("address.state");
  const ref = useRef<HTMLDivElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ResidentialClientInputs> = async (data) => {
    try {
      setErrors(null);
      const newClient = await createResidentialClient(apiUrl, data);

      const updatedUsers = [...residentialClients, newClient].sort((a, b) => {
        const last = a.lastName.localeCompare(b.lastName);
        return last !== 0 ? last : a.firstName.localeCompare(b.firstName);
      });

      setResidentialClients(updatedUsers);
      setOpenModal(null);
      addToast(
        "Success",
        `${newClient.firstName} ${newClient.lastName} successfully added as a client.`
      );
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  useEffect(() => {
    clearErrors();

    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
      Object.entries(errors).forEach(([fieldName, errorMessages]) => {
        const fieldKey = toCamelCasePath(
          fieldName
        ) as keyof ResidentialClientInputs;

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
      <StyledInput
        label="Address Line 1"
        placeholder="123 Bouncehouse Ln"
        register={register("address.street")}
        error={formErrors.address?.street?.message}
      />
      <StyledInput
        label="Address Line 2"
        placeholder="Suite 7"
        register={register("address.unit")}
        error={formErrors.address?.unit?.message}
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

export default ResidentialClientForm;
