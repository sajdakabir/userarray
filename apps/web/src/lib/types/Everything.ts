import { Item } from "./Items";
import { SpaceData } from "./Spaces";
import { WorkspaceMember } from "./Workspaces";

/**
 * A type representing the response from the /ping API for getting everything.
 */
export type Everything = {
  status: number;
  response: {
    members: WorkspaceMember[];
    inbox: Item[];
    spacesData: SpaceData[];
  };
};
