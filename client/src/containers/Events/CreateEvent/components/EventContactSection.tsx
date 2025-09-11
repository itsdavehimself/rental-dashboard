import PhoneInput from "../../../../components/common/PhoneInput";
import StyledInput from "../../../../components/common/StyledInput";
import type { ClientDetail } from "../../../../types/Client";

interface EventContactSectionProps {
  client: ClientDetail | null;
}

const EventContactSection: React.FC<EventContactSectionProps> = ({
  client,
}) => {
  return (
    <div className="flex flex-col gap-4 border-1 border-gray-200 rounded-lg py-4 px-6">
      <h4 className="font-semibold text-lg">Event Contact</h4>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <StyledInput
            label="First Name"
            value={client?.firstName}
            placeholder="Becky"
          />
          <StyledInput
            label="Last Name"
            value={client?.lastName}
            placeholder="Bouncehouse"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <PhoneInput label="Phone Number" value={client?.phoneNumber} />
          <StyledInput
            label="Email"
            value={client?.email}
            placeholder="beckybouncehouse@adrentals.com"
          />
        </div>
      </div>
    </div>
  );
};

export default EventContactSection;
