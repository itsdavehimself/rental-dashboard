type UserMe = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: string;
  startDate: string;
  role: string;
};

type User = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  startDate: Date;
  lastModifiedAt?: Date;
  jobTitle: string;
  isActive: string;
  role: string;
};

type CreateUser = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  startDate: Date;
  jobTitleId: number;
  roleId: number;
  payRate: number;
};

export type { UserMe, User, CreateUser };
