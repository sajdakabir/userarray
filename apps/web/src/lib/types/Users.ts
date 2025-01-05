// export type User = {
//   accounts: {
//     local: {
//       email: string;
//       isVerified: boolean;
//     };
//     google: {
//       isVerified: boolean;
//       email: string;
//       hasAuthorizedEmail: boolean;
//     };
//   };
//   _id: string;
//   fullName: string;
//   userName: string;
//   avatar: string;
//   roles: string[];
  // onboarding: {
  //   profile_complete: boolean;
  //   workspace_create: boolean;
  //   workspace_invite: boolean;
  //   workspace_join: boolean;
  // };
//   hasFinishedOnboarding: boolean;
//   uuid: string;
//   createdAt: string;
// };


import type { Workspace } from './Workspaces';

export type User = {
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