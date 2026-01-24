export type LogisticsWorkType = "Pickup" | "Dropoff" | "Delivery" | "Teardown";

export type TripStatus =
  | "Scheduled"
  | "OnWay"
  | "Arrived"
  | "Completed"
  | "Cancelled";

export type WorkItem = {
  uid: string;
  type: LogisticsWorkType;
  isCompleted: boolean;
  completedAt?: string | null;
  notes?: string | null;
};

export type CrewAssignment = {
  uid: string;
  userUid: string;
  fullName: string;
  isLead: boolean;
  roleNotes?: string | null;
};

export type Trip = {
  uid: string;
  status: TripStatus;

  scheduledStart: string;
  scheduledEnd: string;
  actualStart?: string | null;
  actualArrival?: string | null;
  completedAt?: string | null;

  workItems: WorkItem[];
  crew: CrewAssignment[];

  truckId: number;
  truckName: string;

  crewLeadName?: string | null;
  tripSummary: string;
};

export type Truck = {
  uid: string;
  name: string;
  isActive: boolean;
  capacityCubicFeet?: number | null;
  weightLimit?: number | null;
  notes?: string | null;
  createdAt: string;
  trips: Trip[];
};
