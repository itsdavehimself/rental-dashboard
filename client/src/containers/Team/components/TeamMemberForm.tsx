import { useForm, type SubmitHandler } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import PhoneInput from "../../../components/common/PhoneInput";
import SubmitButton from "../../../components/common/SubmitButton";

export type TeamMemberInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

interface TeamMemberFormProps {
  onSubmit: SubmitHandler<TeamMemberInputs>;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ onSubmit }) => {
  const { handleSubmit, register } = useForm<TeamMemberInputs>();
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center px-8 pt-4 gap-4"
    >
      <StyledInput
        label="First Name"
        placeholder="Becky"
        register={register("firstName")}
      />
      <StyledInput
        label="Last Name"
        placeholder="Bouncehouse"
        register={register("lastName")}
      />
      <StyledInput
        label="Email"
        placeholder="beckybouncehouse@adrentals.com"
        register={register("email")}
      />
      <PhoneInput label="Phone Number" register={register("phoneNumber")} />
      <div className="self-center w-1/4">
        <SubmitButton label="Add" />
      </div>
    </form>
  );
};

export default TeamMemberForm;
