import { Space } from "./Spaces";
export type assign={
  id: string;
  name: string;
}
export type Cycle = {
  _id: string;
  name: string;
  description?: string; // Optional since it's missing in the JSON
  sequenceId?: number;  // Optional since it's missing in the JSON
  startDate?: string;   // Renamed as 'startsAt' in the JSON
  endDate?: string;     // Renamed as 'endsAt' in the JSON
  space?: string;       // No direct match; might be 'team' or 'linearTeamId'
  workspace: string;
  createdBy?: string;   // Not present in the JSON
  isArchived: boolean;
  isDeleted: boolean;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id?: string;          // Added to match the 'id' in JSON
  linearTeamId?: string; // Added to match the 'linearTeamId' in JSON
  team?: string;        // Added to match the 'team' in JSON
  completedAt?: string | null; // Matches the 'completedAt' field
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
