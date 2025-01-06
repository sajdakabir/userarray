import { Cycle } from "./Cycle";
import { Item } from "./Items";
import { Label } from "./Labels";
import { Roadmap } from "./Roadmap";

/**
 * A type representing a state space.
 * A state space is a collection of items, labels, and cycles, roadmaps, and archived items.
 */
export type StateTeam = {
  _id: string;
  uuid: string;
  name: string;
  key: string;
  linearTeamId: string;
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

