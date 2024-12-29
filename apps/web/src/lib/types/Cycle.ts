import { Space } from "./Spaces";

export type Cycle = {
  _id: string;
  name: string;
  description: string;
  sequenceId: number;
  startDate: string;
  endDate: string;
  space: string;
  workspace: string;
  createdBy: string;
  isArchived: boolean;
  isDeleted: boolean;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type createCycleResponse = {
  status: number;
  response: {
    newCycle: Cycle;
    space_detail: Space;
  };
};

export type GetAllCycle = {
  status: number;
  response: {
    upcoming: Cycle[];
    current: Cycle;
    completed: Cycle[];
  };
};

export type GetcycleByUUID = {
  status: number;
  response: Cycle;
};
