type UserMe = {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: string;
  startDate: string;
  roleId: number;
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
  roleId: number;
  payRate?: number;
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
