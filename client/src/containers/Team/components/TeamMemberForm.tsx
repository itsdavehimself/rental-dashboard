import { useForm, type SubmitHandler } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import PhoneInput from "../../../components/common/PhoneInput";
import SubmitButton from "../../../components/common/SubmitButton";
import Dropdown from "../../../components/common/Dropdown";
import { useEffect, useState, useRef } from "react";
import { fetchJobTitles } from "../../../service/jobTitleService";
import { fetchRoles } from "../../../service/roleService";
import CurrencyInput from "../../../components/common/CurrencyInput";

export type TeamMemberInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitleId: number;
  roleId: number;
  payRate: number;
};

interface TeamMemberFormProps {
  onSubmit: SubmitHandler<TeamMemberInputs>;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({ onSubmit }) => {
  const { handleSubmit, register, watch, setValue } =
    useForm<TeamMemberInputs>();

  type Option = { value: number | string; label: string };

  const [jobTitles, setJobTitles] = useState<Option[]>([]);
  const [roles, setRoles] = useState<Option[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const jobTitleRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const jobTitleId = watch("jobTitleId");
  const roleId = watch("roleId");
  const payRate = watch("payRate");

  const toOptions = <T extends { id: number | string }>(
    list: T[],
    labelKey: keyof T
  ): Option[] =>
    list.map((item) => ({
      value: item.id,
      label: String(item[labelKey]),
    }));

  const handleFetchRolesAndJobs = async () => {
    const [jobList, roleList] = await Promise.all([
      fetchJobTitles(apiUrl),
      fetchRoles(apiUrl),
    ]);

    setJobTitles(toOptions(jobList, "title"));
    setRoles(toOptions(roleList, "name"));
  };

  useEffect(() => {
    handleFetchRolesAndJobs();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        !jobTitleRef.current?.contains(event.target as Node) &&
        !roleRef.current?.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

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
      <Dropdown
        ref={jobTitleRef}
        label="Job Title"
        value={jobTitleId}
        selectedLabel={
          jobTitles.find((j) => j.value === jobTitleId)?.label ??
          "Select a Job Title"
        }
        options={jobTitles}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onChange={(val) => setValue("jobTitleId", val as number)}
      />
      <Dropdown
        ref={roleRef}
        label="Role"
        value={roleId}
        selectedLabel={
          roles.find((r) => r.value === roleId)?.label ?? "Select a Role"
        }
        options={roles}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onChange={(val) => setValue("roleId", val as number)}
      />
      <CurrencyInput
        label="Hourly Pay Rate"
        value={payRate}
        onValueChange={(val) => setValue("payRate", val)}
      />
      <div className="self-center w-1/4">
        <SubmitButton label="Add" />
      </div>
    </form>
  );
};

export default TeamMemberForm;
