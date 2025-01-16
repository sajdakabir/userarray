
export type UserProfile = {
  _id: string;
  uuid: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  avatar?: string;
  roles?: string[];
  timezone?: string;
  lastWorkspace?: string | null;
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
    linear_connect?: boolean | null;
    team_create?: boolean | null;
  } | null;
  hasFinishedOnboarding: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UserResponse = {
  status: number;
  response: UserProfile;
};

export type Assignee = {
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
};

export type WorkSpaceLabels = {
  _id: string;
  name: string;
  color: string;
  counter: number;
  workspace: string;
  uuid: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
};