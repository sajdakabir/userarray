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

export const efforts: Status[] = [
  {
    value: "large",
    icon: ShieldAlert,
  },
  {
    value: "medium",
    icon: SignalHigh,
  },
  {
    value: "small",
    icon: SignalMedium,
  },
  {
    value: "none",
    icon: SignalLow,
  },
  // {
  //   value: "none",
  //   icon: SquareSlash,
  // },
];
