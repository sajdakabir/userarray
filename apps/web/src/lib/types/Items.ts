import {
  LucideIcon,
  ShieldAlert,
  Circle,
  SignalHigh,
  SignalMedium,
  SignalLow,
  ChevronRightCircle,
  CheckCircle2,
  GaugeCircle,
} from "lucide-react";

/**
 * Type for a single work item
 */
export type Item = {
  _id: string;
  name: string;
  description: string;
  descriptionHtml: string;
  status: string;
  effort: string;
  dueDate: string | null;
  sequenceId: number;
  createdBy: string;
  space: string;
  workspace: string;
  roadmaps: [];
  cycles: string[];
  assignees: string[];
  labels: string[];
  isArchived: boolean;
  isDeleted: boolean;
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

/**
 * Type guard to check if the data is of type Item
 * @param data - The data to check
 * @returns {boolean} - True if the data is of type Item, false otherwise
 */
export function isItem(data: any): data is Item {
  return (
    typeof data === "object" &&
    data !== null &&
    typeof data._id === "string" &&
    typeof data.uuid === "string"
  );
}

export type SingleItem = {
  status: number;
  response: Item;
};


/**
 * Type guard to check if the data is of type Item[]
 * @param data - The data to check
 * @returns {boolean} - True if the data is of type Item[], false otherwise
 */
export function isItemArray(data: any): data is Item[] {
  return Array.isArray(data) && data.every(isItem);
}

export type AllItems = {
  status: number;
  response: Item[];
};

export type MyItems = {
  inbox: Item[];
  today: {
    current: Item[];
    overdue: Item[];
  };
};

export type MyItemsResponse = {
  status: number;
  response: MyItems;
};

export type Status = {
  value: string;
  icon: LucideIcon;
};

/**
 * Statuses list for the work items
 */
export const statuses: Status[] = [
  {
    value: "inbox",
    icon: Circle,
  },
  {
    value: "todo",
    icon: ChevronRightCircle,
  },
  {
    value: "in progress",
    icon: GaugeCircle,
  },
  {
    value: "done",
    icon: CheckCircle2,
  },
];

/**
 * Efforts list for the work items
 */
export const efforts: Status[] = [
  {
    value: "large",
    icon: SignalHigh,
  },
  {
    value: "medium",
    icon: SignalMedium,
  },
  {
    value: "small",
    icon: SignalLow,
  },
  {
    value: "none",
    icon: Circle,
  },
  // {
  //   value: "none",
  //   icon: SquareSlash,
  // },
];
