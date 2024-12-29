import { CycleActivityState, ItemActivity, ItemActivityState } from "@/lib/types/Activity";
import { Workspace } from "@/lib/types/Workspaces";
import { getItemActivities } from "@/server/fetchers/items/get-activities";
import { produce } from "immer";
import { create } from "zustand";

/**
 * The item activity store is a collection of data that is used to store the state of the application.
 * It includes the space name and activities of each item.
 */
export type itemActivityStore = {
  /**
   * The itemActivity is a collection of data that is used to store the state of the application.
   * It includes the space name and activities of each item.
   */
  itemActivity: ItemActivityState[];

  /**
   * The cycleActivity is a collection of data that is used to store the state of the application.
   * It includes the space name and activities of each cycle.
   */
  cycleActivity: CycleActivityState[];

  /**
   * The setActivity function is used to set the activity of the current workspace.
   * It takes a ItemActivityState as an argument and updates the activity state.
   * @param by - The ItemActivityState to set as the current activity.
   */
  setItemActivity: (by: ItemActivityState[]) => void;

  /**
   * The setCycleActivity function is used to set the activity of the current workspace.
   * It takes a ItemActivityState as an argument and updates the activity state.
   * @param by - The ItemActivityState to set as the current activity.
   */
  setCycleActivity: (by: CycleActivityState[]) => void;

  /**
   * The updateActivityByID function is used to update the activity of a specific item.
   * It takes a space, itemId, and activity as arguments and updates the activity state.
   * @param space - The unique identifier for the space.
   * @param itemId - The unique identifier for the item.
   * @param activity - The ItemActivityState to update the activity with.
   */
  updateItemActivityByID: (
    space: string,
    itemId: string,
    activity: ItemActivity[]
  ) => void;

  /**
   * The fetchActivity function is used to fetch the activity of the current workspace.
   * It takes a token, slug, space, and itemId as arguments and updates the activity state.
   * @param token - The authentication token for the user.
   * @param slug - The unique identifier for the workspace.
   * @param space - The unique identifier for the space.
   * @param itemId - The unique identifier for the item.
   * @returns - A promise that resolves to void.
   */
  //   fetchItemActivity: (
  //     token: string,
  //     slug: string,
  //     space: string,
  //     itemId: string
  //   ) => Promise<void>;

  /**
   * The fetchAllItemActivity function is used to fetch the activity of all items in the current workspace.
   * It takes a token, slug, and workspace as arguments and updates the activity state.
   * @param token - The authentication token for the user.
   * @param workspace - The Workspace object to fetch the activity for.
   * @returns - A promise that resolves to void.
   */
  fetchAllItemActivity: (token: string, workspace: Workspace) => Promise<void>;
};

export const itemActivityStore = create<itemActivityStore>()((set) => ({
  itemActivity: [],
  cycleActivity: [],

  setItemActivity: (by: ItemActivityState[]) =>
    set(produce((state: itemActivityStore) => ({ itemActivity: by }))),

  setCycleActivity: (by: CycleActivityState[]) =>
    set(produce((state: itemActivityStore) => ({ cycleActivity: by }))),

  updateItemActivityByID: (space, itemId, activity) =>
    set(
      produce((state: itemActivityStore) => {
        const itemIndex = state.itemActivity.findIndex(
          (item) => item.space === space
        );
        if (itemIndex !== -1) {
          const activityIndex = state.itemActivity[
            itemIndex
          ].itemActivity.findIndex((act) => act._id === itemId);
          if (activityIndex !== -1) {
            state.itemActivity[itemIndex].itemActivity[activityIndex] = {
              _id: itemId,
              activity: activity,
            };
          } else {
            state.itemActivity[itemIndex].itemActivity.push({
              _id: itemId,
              activity: activity,
            });
          }
        }
      })
    ),

  //   fetchItemActivity: async (
  //     token: string,
  //     slug: string,
  //     space: string,
  //     itemId: string
  //   ) => {
  //     const activity = await getItemActivities(token, slug, space, itemId);
  //   },

  fetchAllItemActivity: async (token: string, workspace: Workspace) => {},
}));
