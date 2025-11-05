import PhoneInput from "../../../../components/common/PhoneInput";
import StyledInput from "../../../../components/common/StyledInput";
import type { ClientDetail } from "../../../Clients/types/Client";
import { type UseFormRegister, type FieldErrors } from "react-hook-form";
import { type CreateEventInputs } from "../CreateEvent";
import { splitPhoneNumber } from "../../../../helpers/formatPhoneNumber";

interface EventContactSectionProps {
  client: ClientDetail | null;
  register: UseFormRegister<CreateEventInputs>;
  formErrors: FieldErrors<CreateEventInputs>;
}

const EventContactSection: React.FC<EventContactSectionProps> = ({
  client,
  register,
  formErrors,
}) => {
  return (
    <div className="flex flex-col gap-4 border-1 border-gray-200 rounded-lg py-4 px-6">
      <h4 className="font-semibold text-lg">Event Contact</h4>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <StyledInput
            label="First Name"
            placeholder="Becky"
            register={register("contactFirstName")}
            error={formErrors.contactFirstName?.message}
          />
          <StyledInput
            label="Last Name"
            placeholder="Bouncehouse"
            register={register("contactLastName")}
            error={formErrors.contactLastName?.message}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <PhoneInput
            label="Phone Number"
            value={splitPhoneNumber(client?.phoneNumber) ?? ""}
            register={register("contactPhone")}
            error={formErrors.contactPhone?.message}
          />
          <StyledInput
            label="Email"
            placeholder="beckybouncehouse@adrentals.com"
            register={register("contactEmail")}
            error={formErrors.contactEmail?.message}
          />
        </div>
      </div>
    </div>
  );
};

export default EventContactSection;
