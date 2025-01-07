import type { Workspace } from './Workspaces';

export type User = {
  _id: string;
  uuid: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  avatar?: string;
  roles?: string[];
  timezone?: string;
  lastWorkspace?: Workspace | null;
  accounts: {
    local: {
      email: string;
      password?: string;
      isVerified: boolean;
    };
    google: {
      email: string;
      id?: string;
      isVerified: boolean;
      hasAuthorizedEmail: boolean;
    };
  };
  onboarding?: {
    profile_complete?: boolean | null;
    workspace_create?: boolean | null;
    workspace_invite?: boolean | null;
    linner_connect?: boolean | null;
    team_Create?: boolean | null;
  } | null;
  hasFinishedOnboarding: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UserResponse = {
  status: number;
  response: User;
};

export type Assignee = {
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
};