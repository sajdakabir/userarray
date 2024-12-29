import { Cycle } from "./Cycle";
import { Item } from "./Items";
import { Label } from "./Labels";
import { Roadmap } from "./Roadmap";
import { WorkspaceMember } from "./Workspaces";

/**
 * A type representing a state space.
 * A state space is a collection of items, labels, and cycles, roadmaps, and archived items.
 */
export type StateSpace = {
  _id: string;
  name: string;
  identifier: string;
  workspace: string;
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

/**
 * A type representing a demo state space.
 */
export const DEMO_STATE: StateSpace = {
  _id: "",
  name: "Demo",
  identifier: "demo",
  workspace: "demo",
  items: [],
  labels: [],
  archived: [],
  cycles: {
    upcoming: [],
    current: {
      _id: "",
      name: "",
      description: "",
      sequenceId: 0,
      startDate: "",
      endDate: "",
      space: "",
      workspace: "",
      createdBy: "",
      isArchived: false,
      isDeleted: false,
      uuid: "",
      createdAt: "",
      updatedAt: "",
      __v: 0,
    },
    completed: [],
  },
  roadmaps: [],
};

/**
 * A type representing a state storage.
 * A state storage is a collection of state spaces, including the slug, name, members, inbox, and spaces.
 */
export type StateStorage = {
  slug: string;
  name: string;
  members: WorkspaceMember[];
  inbox: Item[];
  spaces: StateSpace[];
};
