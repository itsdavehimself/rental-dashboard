import { useEffect, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import PhoneInput from "../../../components/common/PhoneInput";
import BooleanCheckbox from "../../../components/common/BooleanCheckbox";
import SubmitButton from "../../../components/common/SubmitButton";
import XButton from "../../../components/common/XButton";
import { useToast } from "../../../hooks/useToast";
import { useAppDispatch } from "../../../app/hooks";
import { closeModal } from "../../../app/slices/uiSlice";
import { handleError, type ErrorsState } from "../../../helpers/handleError";
import { splitPhoneNumber } from "../../../helpers/formatPhoneNumber";
import {
  updateClientProfile,
  type UpdateClientProfileInput,
} from "../services/clientService";

type EditableClient = {
  uid: string;
  type: number | "Residential" | "Business";
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  businessName?: string;
  isTaxExempt?: boolean;
  isLegacy: boolean;
};

type EditClientProfileInputs = UpdateClientProfileInput;

type EditClientProfileResult = {
  type: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isLegacy?: boolean;
};

interface EditClientProfileFormProps {
  client: EditableClient;
  onSuccess: (updatedClient: EditClientProfileResult) => void;
}

const getClientType = (
  type: EditableClient["type"],
): "Residential" | "Business" => {
  return type === 1 || type === "Business" ? "Business" : "Residential";
};

const EditClientProfileForm: React.FC<EditClientProfileFormProps> = ({
  client,
  onSuccess,
}) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const [, setErrors] = useState<ErrorsState>(null);

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors: formErrors },
  } = useForm<EditClientProfileInputs>({
    defaultValues: {
      type: getClientType(client.type),
      firstName: client.firstName ?? "",
      lastName: client.lastName ?? "",
      email: client.email ?? "",
      phoneNumber: splitPhoneNumber(client.phoneNumber ?? ""),
      businessName: client.businessName ?? "",
      isTaxExempt: client.isTaxExempt ?? false,
      isLegacy: client.isLegacy ?? false,
    },
  });

  const isLegacy = watch("isLegacy");

  useEffect(() => {
    reset({
      type: getClientType(client.type),
      firstName: client.firstName ?? "",
      lastName: client.lastName ?? "",
      email: client.email ?? "",
      phoneNumber: splitPhoneNumber(client.phoneNumber ?? ""),
      businessName: client.businessName ?? "",
      isTaxExempt: client.isTaxExempt ?? false,
      isLegacy: client.isLegacy ?? false,
    });
  }, [client, reset]);

  const onSubmit: SubmitHandler<EditClientProfileInputs> = async (data) => {
    try {
      setErrors(null);

      const payload = {
        ...data,
        type: "Residential" as const,
        businessName: undefined,
        isTaxExempt: false,
      };

      await updateClientProfile(apiUrl, client.uid, payload);

      onSuccess({
        type: 0,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber?.replaceAll("-", ""),
        isLegacy: data.isLegacy,
      });

      addToast("Success", "Client profile updated.");
      dispatch(closeModal());
    } catch (err) {
      handleError(err, setErrors);
      addToast("Error", "Failed to update client profile.");
    }
  };

  return (
    <div
      ref={ref}
      className="relative bg-white h-fit w-[min(52rem,calc(100vw-6rem))] shadow-md rounded-2xl z-10 py-4"
    >
      <div className="flex justify-between items-center pl-6 pr-4">
        <h4 className="text-lg font-semibold">Edit Profile</h4>
        <XButton />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 px-6 pt-4 pb-2"
      >
        <section className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-4">
          <h5 className="font-semibold text-lg">Primary Contact</h5>

          <div className="grid grid-cols-2 gap-4">
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
        </section>

        <div className="flex items-center justify-between pt-4">
          <BooleanCheckbox
            label="Legacy Client"
            checked={!!isLegacy}
            onChange={(val) => setValue("isLegacy", val)}
          />

          <div className="w-40">
            <SubmitButton label="Save" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditClientProfileForm;
