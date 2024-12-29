import { Item } from "./Items";
import { Note } from "./Note";
import { CompactSpace } from "./Spaces";
import { DayBoard, TodayBoard } from "./TodayBoard";
import { Assignee, User } from "./Users";

export type SlugCheck = {
  status: number;
  response: boolean;
};

export type Workspace = {
  _id: string;
  name: string;
  slug: string;
  createdBy: User;
  isDeleted: boolean;
  uuid: string;
  spaces: CompactSpace[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type UserWorkspaces = {
  status: number;
  response: Workspace[];
};

export type WorkspaceBySlug = {
  status: number;
  response: Workspace;
};

export type WorkspaceInvitation = {
  status: number;
  message: string;
};

export type PendingInvitation = {
  _id: string;
  role: string;
  status: string;
  email: string;
  workspace: {
    _id: string;
    name: string;
    slug: string;
  };
  user: string;
  createdBy: Assignee;
  isRevoked: boolean;
  isDeleted: boolean;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type PendingInvitations = {
  status: number;
  response: PendingInvitation[];
};

export type WorkspaceMember = {
  _id: string;
  workspace: string;
  member: User;
  role: string;
  isDeleted: boolean;
  uuid: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type WorkspaceMembers = {
  status: number;
  response: WorkspaceMember[];
};
