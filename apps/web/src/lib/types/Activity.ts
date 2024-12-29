/**
 * Type for a work item activity history
 */
export type ItemActivity = {
  _id: string;
  verb: string;
  field: string;
  comment: string;
  attachments: string[];
  oldIdentifier: string | null;
  newIdentifier: string | null;
  oldValue: string | null;
  newValue: string | null;
  space: string;
  workspace: string;
  item: string;
  actor: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

/**
 * Type for a cycle activity history
 */
export type CycleActivity = {
  _id: string;
  verb: string;
  field: string;
  oldValue: string | null | undefined;
  newValue: string | null | undefined;
  comment: string;
  attachments: [];
  newIdentifier: null | string;
  oldIdentifier: null | string;
  space: string;
  workspace: string;
  item: string;
  cycle: string;
  actor: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

/**
 * Type for a work item comment
 */
export type ItemComment = {
  _id: string;
  verb: string | undefined;
  comment: string;
  attachments: [];
  space: string;
  workspace: string;
  item: string;
  actor: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

/**
 * Type for a cycle comment
 */
export type CycleComment = {
  _id: string;
  verb: string | undefined;
  comment: string;
  attachments: [];
  space: string;
  workspace: string;
  cycle: string;
  actor: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};

/**
 * Type guard for ItemActivity
 * @param obj - The object to check
 * @returns True if the object is of type ItemActivity, false otherwise
 */
export function isItemActivity(obj: any): obj is ItemActivity {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj._id === "string" &&
    typeof obj.verb === "string" &&
    typeof obj.field === "string" &&
    typeof obj.comment === "string" &&
    Array.isArray(obj.attachments) &&
    (obj.oldIdentifier === null || typeof obj.oldIdentifier === "string") &&
    (obj.newIdentifier === null || typeof obj.newIdentifier === "string") &&
    (obj.oldValue === null || typeof obj.oldValue === "string") &&
    (obj.newValue === null || typeof obj.newValue === "string") &&
    typeof obj.space === "string" &&
    typeof obj.workspace === "string" &&
    typeof obj.item === "string" &&
    typeof obj.actor === "string" &&
    typeof obj.uuid === "string" &&
    typeof obj.createdAt === "string" &&
    typeof obj.updatedAt === "string" &&
    typeof obj.__v === "number"
  );
}

/**
 * Type guard for CycleActivity
 * @param obj - The object to check
 * @returns True if the object is of type CycleActivity, false otherwise
 */
export function isCycleActivity(obj: any): obj is CycleActivity {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj._id === "string" &&
    typeof obj.verb === "string" &&
    typeof obj.field === "string" &&
    (typeof obj.oldValue === "string" ||
      obj.oldValue === null ||
      obj.oldValue === undefined) &&
    (typeof obj.newValue === "string" ||
      obj.newValue === null ||
      obj.newValue === undefined) &&
    typeof obj.comment === "string" &&
    Array.isArray(obj.attachments) &&
    (typeof obj.newIdentifier === "string" || obj.newIdentifier === null) &&
    (typeof obj.oldIdentifier === "string" || obj.oldIdentifier === null) &&
    typeof obj.space === "string" &&
    typeof obj.workspace === "string" &&
    typeof obj.item === "string" &&
    typeof obj.cycle === "string" &&
    typeof obj.actor === "string" &&
    typeof obj.uuid === "string" &&
    typeof obj.createdAt === "string" &&
    typeof obj.updatedAt === "string" &&
    obj.__v === 0
  );
}

/**
 * Type guard for ItemComment
 * @param obj - The object to check
 * @returns True if the object is of type ItemComment, false otherwise
 */
export function isItemComment(obj: any): obj is ItemComment {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj._id === "string" &&
    (typeof obj.verb === "string" || obj.verb === undefined) &&
    typeof obj.comment === "string" &&
    Array.isArray(obj.attachments) &&
    typeof obj.space === "string" &&
    typeof obj.workspace === "string" &&
    typeof obj.item === "string" &&
    typeof obj.actor === "string" &&
    typeof obj.uuid === "string" &&
    typeof obj.createdAt === "string" &&
    typeof obj.updatedAt === "string" &&
    typeof obj.__v === "number"
  );
}

/**
 * Type guard for CycleComment
 * @param obj - The object to check
 * @returns True if the object is of type CycleComment, false otherwise
 */
export function isCycleComment(obj: any): obj is CycleComment {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj._id === "string" &&
    (typeof obj.verb === "string" || obj.verb === undefined) &&
    typeof obj.comment === "string" &&
    Array.isArray(obj.attachments) &&
    typeof obj.space === "string" &&
    typeof obj.workspace === "string" &&
    typeof obj.cycle === "string" &&
    typeof obj.actor === "string" &&
    typeof obj.uuid === "string" &&
    typeof obj.createdAt === "string" &&
    typeof obj.updatedAt === "string" &&
    typeof obj.__v === "number"
  );
}

/**
 * Type for a work item activity array for a space
 */
export type SpaceItemActivity = {
  _id: string;
  activity: ItemActivity[] | ItemComment[];
};

/**
 * Type for a cycle activity array for a space
 */
export type SpaceCycleActivity = {
  _id: string;
  activity: CycleActivity[] | CycleComment[];
};

/**
 * Type for a work item activity history response
 */
export type ItemActivityResponse = {
  status: number;
  response: ItemActivity[] | ItemComment[];
};

/**
 * Type for a cycle activity history response
 */
export type CycleActivityResponse = {
  status: number;
  response: CycleActivity[] | CycleComment[];
};

/**
 * Type for the item activity store
 */
export type ItemActivityState = {
  space: string;
  itemActivity: SpaceItemActivity[];
};

/**
 * Type for the cycle activity store
 */
export type CycleActivityState = {
  space: string;
  cycleActivity: SpaceCycleActivity[];
};
