import TextAreaInput from "../../../../components/common/TextAreaInput";
import { type UseFormRegister } from "react-hook-form";
import { type CreateEventInputs } from "../CreateEvent";

interface EventInternalNotesProps {
  register: UseFormRegister<CreateEventInputs>;
}

const EventInternalNotes: React.FC<EventInternalNotesProps> = ({
  register,
}) => {
  return (
    <div className="flex flex-col gap-4 border-1 border-gray-200 rounded-lg py-4 px-6">
      <h4 className="font-semibold text-lg">Internal Notes</h4>
      <div className="flex flex-col gap-4">
        <TextAreaInput
          label="Notes"
          placeholder="Client pays cash on delivery."
          register={register("internalNotes")}
          optional={true}
        />
      </div>
    </div>
  );
};

export default EventInternalNotes;
