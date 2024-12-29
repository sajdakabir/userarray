export type Roadmap = {
  _id: string;
  name: string;
  description: string;
  sequenceId: number;
  target: null;
  targetDate: string | null;
  horizon: string;
  updatedBy: string;
  space: string;
  workspace: string;
  assignees: string[];
  labels: string[];
  isArchived: boolean;
  isDeleted: boolean;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

export type SingleRoadmap = {
  status: number;
  response: Roadmap;
};
