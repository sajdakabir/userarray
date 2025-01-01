export type User = {
  accounts: {
    local: {
      email: string;
      isVerified: boolean;
    };
    google: {
      isVerified: boolean;
      email: string;
      hasAuthorizedEmail: boolean;
    };
  };
  _id: string;
  fullName: string;
  userName: string;
  avatar: string;
  roles: string[];
  onboarding: {
    profile_complete: boolean;
    workspace_create: boolean;
    workspace_invite: boolean;
    workspace_join: boolean;
    linear_connected: boolean;
  };
  hasFinishedOnboarding: boolean;
  uuid: string;
  createdAt: string;
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