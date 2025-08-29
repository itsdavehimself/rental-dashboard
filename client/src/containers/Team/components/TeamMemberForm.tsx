import { useForm, type SubmitHandler } from "react-hook-form";
import StyledInput from "../../../components/common/StyledInput";
import PhoneInput from "../../../components/common/PhoneInput";
import SubmitButton from "../../../components/common/SubmitButton";
import Dropdown from "../../../components/common/Dropdown";
import { useEffect, useState, useRef } from "react";
import { fetchJobTitles } from "../../../service/jobTitleService";
import { fetchRoles } from "../../../service/roleService";
import CurrencyInput from "../../../components/common/CurrencyInput";
import DatePicker from "../../../components/common/DatePicker";
import { registerUser } from "../../../service/authService";
import { type TeamModalType } from "../Team";
import { handleError, type ErrorsState } from "../../../helpers/handleError";
import type { User } from "../../../types/User";
import { useToast } from "../../../hooks/useToast";

export type TeamMemberInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  jobTitleId: number;
  roleId: number;
  payRate: number;
  startDate: Date;
};

interface TeamMemberFormProps {
  errors: object | null;
  setErrors: React.Dispatch<React.SetStateAction<ErrorsState>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  users: User[];
  setOpenModal: React.Dispatch<React.SetStateAction<TeamModalType>>;
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  errors,
  setErrors,
  users,
  setUsers,
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
  } = useForm<TeamMemberInputs>({ defaultValues: { startDate: new Date() } });

  type Option = { value: number | string; label: string };

  const { addToast } = useToast();

  const [jobTitles, setJobTitles] = useState<Option[]>([]);
  const [roles, setRoles] = useState<Option[]>([]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  const jobTitleRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const jobTitleId = watch("jobTitleId");
  const roleId = watch("roleId");
  const payRate = watch("payRate");
  const startDate = watch("startDate");

  const onSubmit: SubmitHandler<TeamMemberInputs> = async (data) => {
    try {
      setErrors(null);
      const newUser = await registerUser(apiUrl, data);
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      setOpenModal(null);
      addToast(
        "Success",
        `${newUser.firstName} ${newUser.lastName} successfully added to the team.`
      );
    } catch (err) {
      handleError(err, setErrors);
    }
  };

  useEffect(() => {
    clearErrors();
    if (errors && typeof errors === "object" && !Array.isArray(errors)) {
      Object.entries(errors).forEach(([fieldName, errorMessages]) => {
        const camelCaseFieldName =
          fieldName.charAt(0).toLowerCase() + fieldName.slice(1);

        const fieldKey = camelCaseFieldName as keyof TeamMemberInputs;

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
    if (formErrors.jobTitleId || formErrors.roleId) {
      if (jobTitleId && formErrors.jobTitleId) {
        clearErrors("jobTitleId");
      }
      if (roleId && formErrors.roleId) {
        clearErrors("roleId");
      }
    }
  }, [
    jobTitleId,
    roleId,
    clearErrors,
    formErrors.jobTitleId,
    formErrors.roleId,
  ]);

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
      <DatePicker
        label="Start Date"
        date={startDate}
        onSelect={(val) => setValue("startDate", val)}
      />
      <Dropdown
        ref={jobTitleRef}
        label="Job Title"
        value={jobTitleId}
        selectedLabel={
          jobTitles.find((j) => j.value === jobTitleId)?.label ??
          "Select a job title"
        }
        options={jobTitles}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onChange={(val) => setValue("jobTitleId", val as number)}
        error={formErrors.jobTitleId?.message}
      />
      <Dropdown
        ref={roleRef}
        label="Role"
        value={roleId}
        selectedLabel={
          roles.find((r) => r.value === roleId)?.label ?? "Select a role"
        }
        options={roles}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        onChange={(val) => setValue("roleId", val as number)}
        error={formErrors.roleId?.message}
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
