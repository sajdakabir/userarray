import axios from "axios";
import { User, UserResponse } from "@/lib/types/Users";
import {
  UserWorkspaces,
  Workspace,
  WorkspaceMember,
} from "@/lib/types/Workspaces";
import { GET_USER, USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getUser } from "@/server/fetchers/user/getdetails";
import { getAllWorkspaces } from "@/server/fetchers/workspace/get-workspace";
import { StateSpace, StateStorage } from "@/lib/types/States";
import getEverything from "@/server/fetchers/workspace/get-everything";
import { produce } from "immer";
import { MyItems } from "@/lib/types/Items";
import { MemberDayBoard, MyTodayResponse } from "@/lib/types/TodayBoard";


/**
 * The userData type is used to represent the state of the user's workspace.
 * It includes the slug, current, and sidebar properties.
 */
export type userData = {
  /**
   * The slug is a unique identifier for the workspace.
   */
  slug: string;

  /**
   * The current is the page url that the user is currently working on.
   */
  current: string;

  /**
   * The sidebar is a boolean value that determines whether the sidebar is visible or not.
   */
  sidebar: boolean;

  /**
   * The setSlug function is used to set the slug of the current workspace.
   * It takes a string as an argument and updates the slug state.
   * @param by - The string that represents the new slug.
   */
  setSlug: (by: string) => void;

  /**
   * The setCurrent function is used to set the current page url of the user.
   * It takes a string as an argument and updates the current state.
   * @param by - The string that represents the new current page url.
   */
  setCurrent: (by: string) => void;

  /**
   * The setSidebar function is used to set the sidebar visibility of the user.
   * It takes a boolean as an argument and updates the sidebar state.
   * @param by - The boolean that represents the new sidebar visibility.
   */
  setSidebar: (by: boolean) => void;
};

/**
 * The work type is used to represent the state of the user's workspace.
 * It includes the user, workspaces, stateStorage, and dayBoards properties.
 */
export type work = {
  /**
   * The user object contains information about the user, such as their name, email, id and onboarding status.
   */
  user: User | null;

  /**
   * The workspaces array contains information about the different workspaces that the user has access to.
   * It includes the name, slug, and members of each workspace.
   */
  workspaces: Workspace[];

  /**
   * The state storage is a collection of data that is used to store the state of the application.
   * It includes information about the workspace, such as the name, members, spaces, and items.
   */
  stateStorage: StateStorage | null;

  /**
   * The dayBoards array contains information about the different day's work of each member.
   * It includes the date, items, and notes of each day.
   */
  dayBoards: MemberDayBoard[];

  // fetch functions

  /**
   * Fetches the user information using the provided token.
   *
   * @param {string} token - The token used to authenticate the request.
   * @returns {Promise<boolean>} - Returns a promise that resolves to true if the user is fetched successfully, otherwise false.
   */
  fetchUser: (token: string) => Promise<boolean>;

  /**
   * Fetches the workspaces for a user based on the provided token.
   *
   * @param {string} token - The authentication token for the user.
   * @returns {Promise<boolean>} - Returns a promise that resolves to true if workspaces are fetched successfully, otherwise false.
   */
  fetchWorkspaces: (token: string) => Promise<boolean>;

  /**
   * Fetches the current user's today's items and note for a given workspace and sets the dayBoards state array with only current user's dayBoard.
   * This function is executed only once when the user opens or refreshes the page.
   * @param {string} token - The authentication token for the user.
   * @param {string} slug - The unique identifier for the workspace.
   * @returns {Promise<void>} - A promise that resolves when the current user's today's items and note are fetched successfully.
   */
  fetchCurrentUserToday: (token: string, slug: string) => Promise<boolean>;

  /**
   * Asynchronously builds the state storage for a given workspace.
   *
   * @param {string} token - The authentication token.
   * @param {string} slug - The unique identifier for the workspace.
   * @param {Workspace} workspace - The workspace object containing initial data.
   * @returns {Promise<void>} - A promise that resolves when the state storage is built.
   */
  buildStateStorage: (
    token: string,
    slug: string,
    workspace: Workspace
  ) => Promise<void>;

  // Setter functions

  /**
   * Sets the user state with the provided user object.
   *
   * @param by - The user object to set as the current user.
   */
  setUser: (by: User) => void;
  /**
   * Sets the workspaces state with the provided array of workspaces.
   *
   * @param {Workspace[]} by - An array of Workspace objects to set as the new state.
   */
  setWorkspaces: (by: Workspace[]) => void;
  /**
   * Sets the stateStorage to null.
   */
  setStateNull: () => void;
  /**
   * Updates the state storage with the provided state spaces.
   *
   * @param {StateSpace[]} spaces - An array of state spaces to be set in the state storage.
   */
  setStateSpaces: (spaces: StateSpace[]) => void;
  /**
   * Updates the state with the provided workspace members.
   *
   * @param members - An array of WorkspaceMember objects to be set in the state.
   */
  setStateMembers: (members: WorkspaceMember[]) => void;

  /**
   * Updates the state storage with the provided items and spaces.
   *
   * @param {MyItems} myItems - The items to be stored in the state.
   * @param {StateSpace[]} spaces - The spaces to be stored in the state.
   */
  setStateStorage: (myItems: MyItems, spaces: StateSpace[]) => void;

  /**
   * Updates the dayBoards state with the provided dayBoards array.
   *
   * @param by - An array of MemberDayBoard objects to be set in the state.
   */
  setDayBoards: (by: MemberDayBoard[]) => void;

  // Update functions

  /**
   * Updates the user information by making an API call.
   *
   * @param {User} by - The user object containing updated information.
   * @param {string} token - The authorization token for the API call.
   * @returns {Promise<boolean>} - Returns true if the update is successful, otherwise false.
   */
  updateUser: (by: User, token: string) => Promise<boolean>;
  /**
   * Asynchronously updates the user data with the provided user object.
   *
   * @param {Workspace[]} by - An array of Workspace objects to set as the new state.
   * @param {string} token - The authentication token.
   * @returns {Promise<boolean>} - A promise that resolves to true if the update is successful, false otherwise.
   */
  updateWorkspaces: (by: Workspace[], token: string) => Promise<boolean>;
};



// This data will be persistent inside the local storage
export const userStore = create<userData>()(
  persist(
    (set) => ({
      sidebar: false,
      slug: "",
      current: "",
      setSlug: (by) => set(() => ({ slug: by })),
      setCurrent: (by) => set(() => ({ current: by })),
      setSidebar: (by) => set(() => ({ sidebar: by })),
    }),
    {
      name: "userPreference",
    }
  )
);

// This data will be available in the global state store but not in the local storage
export const dataStore = create<work>()((set) => ({
  user: null,
  workspaces: [],
  stateStorage: null,
  dayBoards: [],

  fetchUser: async (token: string) => {
    const user: UserResponse | null = await getUser(token);
    if (user) {
      set(() => ({ user: user.response }));
      return true;
    }
    return false;
  },

  fetchWorkspaces: async (token: string) => {
    const workspaces: UserWorkspaces | null = await getAllWorkspaces(token);
    if (workspaces) {
      set(() => ({ workspaces: workspaces.response }));
      return true;
    }
    return false;
  },

  fetchCurrentUserToday: async (token: string, slug: string) => {
    try {
      const { data }: { data: MyTodayResponse } = await axios.get(
        USER_WORKSPACE + `/${slug}/today`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const td: MemberDayBoard = {
        id: "CURRENT_USER",
        today: {
          current: data.response.current,
          overdue: data.response.overdue,
          note: data.response.note,
        },
        days: [],
      };
      set(() => ({
        dayBoards: [td],
      }));
      return true;
    } catch (error) {
      return false;
    }
  },

  setUser: (by: User) => set(() => ({ user: by })),

  updateUser: async (by: User, token: string) => {
    try {
      const { data } = await axios.patch(GET_USER, by, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // If the API call is successful, update the state and return true
      set(() => ({ user: by }));
      return true;
    } catch (error) {
      return false;
    }
  },

  setWorkspaces: (by: Workspace[]) => set(() => ({ workspaces: by })),

  updateWorkspaces: async (by: Workspace[], token: string) => {
    try {
      const { data } = await axios.patch(GET_USER, by, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // If the API call is successful, update the state and return true
      set(() => ({ workspaces: by }));
      return true;
    } catch (error) {
      return false;
    }
  },

  buildStateStorage: async (
    token: string,
    slug: string,
    workspace: Workspace
  ) => {
    const eve = await getEverything(token, slug);
    const everything = eve!.response;

    const spaces: StateSpace[] = workspace.teams.map((team, index) => {
      return {
        ...team,
        ...everything.spacesData[index],
      };
    });
    const data: StateStorage = {
      slug: slug,
      name: workspace.name,
      members: everything.members,
      inbox: everything.inbox,
      spaces: spaces,
    };
    set(() => ({ stateStorage: data }));
  },

  setStateNull: () => {
    set(() => ({ stateStorage: null }));
  },

  setStateSpaces: (spaces: StateSpace[]) => {
    set(
      produce((state: work) => ({
        stateStorage: { ...state.stateStorage, spaces: spaces },
      }))
    );
  },

  setStateStorage: (myItems: MyItems, spaces: StateSpace[]) => {
    set(
      produce((state: work) => ({
        stateStorage: {
          ...state.stateStorage,
          inbox: myItems.inbox,
          today: myItems.today,
          spaces: spaces,
        },
        dayBoards: [
          {
            id: state.dayBoards[0].id,
            days: state.dayBoards[0].days,
            today: {
              current: myItems.today.current,
              overdue: myItems.today.overdue,
              note: state.dayBoards[0].today.note,
            },
          },
          ...state.dayBoards.slice(1),
        ],
      }))
    );
  },

  setStateMembers: (members: WorkspaceMember[]) => {
    set(
      produce((state: work) => ({
        stateStorage: { ...state.stateStorage, members: members },
      }))
    );
  },

  setDayBoards: (by: MemberDayBoard[]) => {
    set(() => ({ dayBoards: by }));
  },
}));
