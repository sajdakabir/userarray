import { Cycle } from "./Cycle";
import { Item } from "./Items";
import { Label } from "./Labels";
import { Roadmap } from "./Roadmap";

export type Space = {
  _id: string;
  name: string;
  identifier: string;
  workspace: string;
  createdBy: string;
  cycleView: boolean;
  roadmapView: boolean;
  backlogView: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type CompactSpace = {
  _id: string;
  name: string;
  identifier: string;
  workspace: string;
};

export type SingleSpace = {
  status: number;
  response: Space;
};

export type AllSpaces = {
  status: number;
  response: Space[];
};

export type SpaceData = {
  uuid: string;
  name: string;
  identifier: string;
  items: Item[];
  labels: Label[];
  archived: Item[];
  cycles: {
    upcoming: Cycle[];
    current: Cycle;
    completed: Cycle[];
  };
  roadmaps: Roadmap[];
};
