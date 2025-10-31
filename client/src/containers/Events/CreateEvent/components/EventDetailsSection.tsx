import StyledInput from "../../../../components/common/StyledInput";
import TextAreaInput from "../../../../components/common/TextAreaInput";
import { type UseFormRegister } from "react-hook-form";
import { type CreateEventInputs } from "../CreateEvent";

interface EventDetailsSectionProps {
  register: UseFormRegister<CreateEventInputs>;
}

const EventDetailsSection: React.FC<EventDetailsSectionProps> = ({
  register,
}) => {
  return (
    <>
      <div className="flex flex-col flex-grow gap-4 border-1 border-gray-200 rounded-lg py-4 px-6 overflow-hidden">
        <h4 className="font-semibold text-lg">Details & Notes</h4>
        <StyledInput
          label="Event Name"
          optional={true}
          placeholder="Becky's 45th Birthday"
          register={register("eventName")}
        />
        <StyledInput
          label="Event Type"
          placeholder="Birthday"
          register={register("eventType")}
        />
        <TextAreaInput
          label="Notes"
          placeholder="Tent goes across the driveway. Be careful of sprinklers in the lawn."
          register={register("eventNotes")}
          optional={true}
        />
      </div>
    </>
  );
};

export default EventDetailsSection;
