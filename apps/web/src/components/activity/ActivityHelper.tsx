import {
  CycleActivity,
  CycleActivityState,
  CycleComment,
  ItemActivity,
  ItemActivityState,
  ItemComment,
  SpaceCycleActivity,
  SpaceItemActivity,
  isCycleActivity,
  isItemActivity,
} from "@/lib/types/Activity";
import { dataStore, userStore } from "@/utils/store/zustand";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  CircleUserRound,
  FilePen,
  MessageSquare,
  SquarePen,
  Tag,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { FC, useMemo } from "react";
import { GetSmallPriority, GetSmallStatusIcon } from "../smalls/items/GetIcons";
import { Item } from "@radix-ui/react-dropdown-menu";

type ActivityHelperProps = {
  activity: ItemActivity | ItemComment | CycleActivity | CycleComment;
};

type ItemActivityProps = {
  activity: ItemActivity | ItemComment;
};

type CycleActivityProps = {
  activity: CycleActivity | CycleComment;
};

type SeqIdHelperProps = {
  activity: ItemActivity | CycleActivity;
};

/**
 * Formats a date string to "MMMM d, yy"
 * @param dateStr The date string to format
 * @returns The formatted date string
 */
export const getFormattedDate = (dateStr: string) => {
  const date = parseISO(dateStr);
  return format(date, "MMMM d, yy");
};

/**
 * The getUpdatedActivities function is used to update the activity state based on the provided activity and space.
 * It takes an ItemActivityState array, an ItemActivity array, a space string, and an itemId string as arguments.
 * It returns a new ItemActivityState array with the updated activity.
 * @param activityState - The current activity state array.
 * @param activity - The new activity array.
 * @param space - The space string.
 * @param id - The itemId string.
 * @returns A new ItemActivityState array with the updated activity.
 */
export const getUpdatedItemActivities = (
  activityState: ItemActivityState[],
  activity: ItemActivity[] | ItemComment[],
  space: string,
  id: string
) => {
  const spaceIndex = activityState.findIndex((item) => item.space === space);
  let activityCopy = JSON.parse(
    JSON.stringify(activityState)
  ) as ItemActivityState[];
  const newActivity: SpaceItemActivity = {
    _id: id,
    activity: activity,
  };
  if (spaceIndex !== -1) {
    const activityIndex = activityCopy[spaceIndex].itemActivity.findIndex(
      (act) => act._id === id
    );
    if (activityIndex !== -1) {
      activityCopy[spaceIndex].itemActivity[activityIndex] = newActivity;
    } else {
      activityCopy[spaceIndex].itemActivity.push(newActivity);
    }
    return activityCopy;
  }
  const newActivitySpace = {
    space: space,
    itemActivity: [newActivity],
  };
  activityCopy.push(newActivitySpace);
  return activityCopy;
};

/**
 * The getUpdatedCycleActivities function is used to update the activity state based on the provided activity and space.
 * It takes an CycleActivityState array, an CycleActivity array, a space string, and an itemId string as arguments.
 * It returns a new CycleActivityState array with the updated activity.
 * @param activityState - The current activity state array.
 * @param activity - The new activity array.
 * @param space - The space string.
 * @param id - The cycleId string.
 * @returns A new CycleActivityState array with the updated activity.
 */
export const getUpdatedCycleActivities = (
  activityState: CycleActivityState[],
  activity: CycleActivity[] | CycleComment[],
  space: string,
  id: string
) => {
  const spaceIndex = activityState.findIndex((item) => item.space === space);
  let activityCopy = JSON.parse(
    JSON.stringify(activityState)
  ) as CycleActivityState[];
  const newActivity: SpaceCycleActivity = {
    _id: id,
    activity: activity,
  };
  if (spaceIndex !== -1) {
    const activityIndex = activityCopy[spaceIndex].cycleActivity.findIndex(
      (act) => act._id === id
    );
    if (activityIndex !== -1) {
      activityCopy[spaceIndex].cycleActivity[activityIndex] = newActivity;
    } else {
      activityCopy[spaceIndex].cycleActivity.push(newActivity);
    }
    return activityCopy;
  }
  const newActivitySpace = {
    space: space,
    cycleActivity: [newActivity],
  };
  activityCopy.push(newActivitySpace);
  return activityCopy;
};

export const GetActorName: FC<ActivityHelperProps> = ({ activity }) => {
  const slug = userStore((state) => state.slug);
  const stateStorage = dataStore((state) => state.stateStorage);

  const members = useMemo(() => {
    if (!stateStorage) {
      return [];
    }
    return stateStorage.members;
  }, [stateStorage]);

  const actor = activity.actor;
  const member = members.find((member) => member.member._id === actor);
  if (member) {
    return (
      <Link href={`/${slug}/settings/members`}>
        <span className="text-focus-text-hover w-fit hover:underline cursor-pointer">
          {member.member.userName || member.member.fullName.split(" ")[0]}
        </span>
      </Link>
    );
  }
  return (
    <Link href={`/${slug}/settings/members`}>
      <span className="w-fit hover:underline cursor-pointer">A member</span>
    </Link>
  );
};

export const GetActivityIcon: FC<ActivityHelperProps> = ({ activity }) => {
  if (isItemActivity(activity)) {
    if (activity.field === "dueDate") return <Calendar size={14} />;
    if (activity.field === "description") return <SquarePen size={14} />;
    if (activity.field === "name") return <FilePen size={14} />;
    if (activity.field === "assignees") return <CircleUserRound size={16} />;
    if (activity.field === "labels") return <Tag size={14} />;
    if (activity.field === "cycle") return <Zap size={14} />;
    if (activity.field === "effort")
      return <GetSmallPriority value={activity.newValue!} />;
    if (activity.field === "status")
      return <GetSmallStatusIcon value={activity.newValue!} />;
    return <></>;
  } else if (activity.verb !== undefined) {
    return <SquarePen size={14} />;
  }
  return <MessageSquare size={14} />;
};

type GetChangeProps = {
  activity: ItemActivity | CycleActivity;
  isCycle: boolean;
};

export const GetChange: FC<GetChangeProps> = ({ activity, isCycle }) => {
  if (isItemActivity(activity)) {
    if (activity.field === "dueDate") {
      return (
        <span className="text-focus-text-hover">
          to {getFormattedDate(activity.newValue!)}{" "}
          {isCycle && (
            <>
              for <ItemSeqIdString activity={activity} />
            </>
          )}
          .
        </span>
      );
    }
    if (activity.comment.includes("removed")) {
      return (
        <span className="text-focus-text-hover">{activity.oldValue}.</span>
      );
    }
    return <span className="text-focus-text-hover">{activity.newValue}.</span>;
  }
  return <></>;
};

export const ItemActivityString: FC<ItemActivityProps> = ({ activity }) => {
  if (isItemActivity(activity)) {
    if (activity.field === "description") {
      // Item description update
      return (
        <div>
          <GetActorName activity={activity} />
          <span> updated the description.</span>
        </div>
      );
    }
    if (activity.field === "name") {
      // Item name update
      return (
        <div>
          <GetActorName activity={activity} />
          <span>
            {" "}
            {activity.comment} to {activity.newValue}.
          </span>
        </div>
      );
    }
    if (activity.field === "effort" || activity.field === "status") {
      // Item effort or status update
      return (
        <div>
          <GetActorName activity={activity} />
          <span> {activity.comment}</span>
        </div>
      );
    }
    if (activity.field === "cycle") {
      // Cycle adding Activity
      return (
        <div>
          <GetActorName activity={activity} />
          <span>
            {" "}
            {activity.verb === "created" ? "added" : "removed"}{" "}
            {activity.comment}.
          </span>
        </div>
      );
    }
    return (
      // Regular Item Activity
      <div>
        <GetActorName activity={activity} />
        <span>
          {" "}
          {activity.comment} <GetChange activity={activity} isCycle={false} />
        </span>
      </div>
    );
  } else {
    if (activity.verb !== undefined) {
      // Item creation Activity
      return (
        <div>
          <GetActorName activity={activity} /> {activity.comment}.
        </div>
      );
    } else {
      // Item comment
      return (
        <div>
          <GetActorName activity={activity} /> commented.{" "}
          {activity.updatedAt !== activity.createdAt ? (
            <span className="text-nonfocus-text">(edited)</span>
          ) : null}
        </div>
      );
    }
  }
};

export const ItemSeqIdString: FC<SeqIdHelperProps> = ({ activity }) => {
  const slug = userStore((state) => state.slug);
  const stateStorage = dataStore((state) => state.stateStorage);
  if (!stateStorage) return <span className="text-focus-text-hover">Item</span>;
  const spaceIndex = stateStorage.spaces.findIndex(
    (space) => space._id === activity.space
  );
  if (spaceIndex === -1)
    return <span className="text-focus-text-hover">Item</span>;
  const itemIndex = stateStorage.spaces[spaceIndex].items.findIndex(
    (item) => item._id === activity.item
  );
  return (
    <Link
      href={`/${slug}/${stateStorage.spaces[spaceIndex].name}/item/${activity.item}`}
      className="text-focus-text-hover hover:underline cursor-pointer"
    >
      <span>
        {stateStorage.spaces[spaceIndex].identifier} -{" "}
        {stateStorage.spaces[spaceIndex].items[itemIndex].sequenceId}
      </span>
    </Link>
  );
};

export const CycleActivityString: FC<CycleActivityProps> = ({ activity }) => {
  if (isCycleActivity(activity)) {
    if (activity.field === "description") {
      // Item description update
      return (
        <div>
          <GetActorName activity={activity} /> {activity.comment} of{" "}
          <ItemSeqIdString activity={activity} />.
        </div>
      );
    }
    if (activity.field === "name") {
      // Item name update
      return (
        <div>
          <GetActorName activity={activity} /> {activity.comment} of{" "}
          <ItemSeqIdString activity={activity} /> to{" "}
          <span className="text-focus-text-hover">{activity.newValue}</span>.
        </div>
      );
    }
    if (activity.field === "effort" || activity.field === "status") {
      // Item effort or status update
      return (
        <div>
          <GetActorName activity={activity} />
          <span> {activity.comment}</span> for{" "}
          <ItemSeqIdString activity={activity} />
        </div>
      );
    }
    if (activity.field === "labels" || activity.field === "assignees") {
      // Item labels or assignees update
      return (
        <div>
          <GetActorName activity={activity} />
          <span> {activity.comment}</span>{" "}
          {activity.comment.includes("removed") ? (
            <span>{activity.oldValue} from </span>
          ) : (
            <span>{activity.newValue} to </span>
          )}
          <ItemSeqIdString activity={activity} />
        </div>
      );
    }
    if (activity.field === "cycle") {
      // Cycle adding Activity
      return (
        <div>
          <GetActorName activity={activity} />
          <span>
            {" "}
            {activity.verb === "created" ? (
              <span>
                added <ItemSeqIdString activity={activity} />
              </span>
            ) : (
              <span>
                removed <ItemSeqIdString activity={activity} />
              </span>
            )}{" "}
            {activity.comment}.
          </span>
        </div>
      );
    }
    return (
      // Regular Item Activity
      <div>
        <GetActorName activity={activity} />
        <span>
          {" "}
          {activity.comment} <GetChange activity={activity} isCycle={true} />
        </span>
      </div>
    );
  } else {
    if (activity.verb !== undefined) {
      // Item creation Activity
      return (
        <div>
          <GetActorName activity={activity} /> {activity.comment}.
        </div>
      );
    } else {
      // Item comment
      return (
        <div>
          <GetActorName activity={activity} /> commented.{" "}
          {activity.updatedAt !== activity.createdAt ? (
            <span className="text-nonfocus-text">(edited)</span>
          ) : null}
        </div>
      );
    }
  }
};
