import { efforts, statuses } from "@/lib/types/Items";
import { FC } from "react";

interface MyComponentProps {
  value: string;
}

type PriorityIconProps = {
  value: Number;
  color: string;
};

export const GetPriority: FC<PriorityIconProps> = ({ value, color }) => {
  // Find the effort that matches the value
  const prio = efforts.find((prio) => prio.value === value.toString());
  // If a matching effort was found, render the icon
  if (prio) {
    const Icon = prio.icon;
    return <Icon className={color} size={14} />;
  }
  return null;
};

export const GetSmallPriority: FC<MyComponentProps> = ({ value }) => {
  // Find the effort that matches the value
  const prio = efforts.find((prio) => prio.value === value);
  // If a matching effort was found, render the icon
  if (prio) {
    const Icon = prio.icon;
    return <Icon size={14} />;
  }
  return null;
};

export const GetSmallStatusIcon: FC<MyComponentProps> = ({ value }) => {
  // Find the effort that matches the value
  const status = statuses.find((status) => status.value === value);
  // If a matching effort was found, render the icon
  if (status) {
    const Icon = status.icon;
    return <Icon size={16} />;
  }
  return null;
};

export const GetStatus: FC<MyComponentProps> = ({ value }) => {
  // Find the status that matches the value
  const status = statuses.find((status) => status.value === value);
  // If a matching status was found, render the icon
  if (status) {
    const Icon = status.icon;
    return <Icon className="min-h-5 min-w-5" strokeWidth={1.2} />;
  }
  return null;
};

export const GetSmallStatus: FC<MyComponentProps> = ({ value }) => {
  // Find the status that matches the value
  const status = statuses.find((status) => status.value === value);
  // If a matching status was found, render the icon
  if (status) {
    const Icon = status.icon;
    return <Icon size={17} strokeWidth={2} />;
  }
  return null;
};

export const getStatusColor = (status: string) => {
  if (status === "done") return "bg-focus-text-hover";
  if (status === "in progress") return "bg-highlight";
  return "bg-less-highlight";
};
