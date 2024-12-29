import { Cycle } from "@/lib/types/Cycle";
import { Item } from "@/lib/types/Items";
import { dataStore, userStore } from "@/utils/store/zustand";
import { format } from "date-fns";
import { CircleDashed } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import UserAvatar from "../avatar/UserAvatar";

type ActiveCycleProps = {
  cycle: Cycle;
  space: string;
  spaceIndex: number;
};

const ActiveCycle: React.FC<ActiveCycleProps> = ({
  cycle,
  space,
  spaceIndex,
}) => {
  const stateStorage = dataStore((state) => state.stateStorage);
  const slug = userStore((state) => state.slug);

  const members = useMemo(() => {
    if (!stateStorage) return [];
    return stateStorage.members;
  }, [stateStorage]);

  const cycleItems = useMemo(() => {
    if (!stateStorage) return [];
    const all_Items = stateStorage.spaces[spaceIndex].items;
    let items: Item[] = [];
    all_Items.forEach((item) => {
      item.cycles.forEach((c) => {
        if (c === cycle._id) {
          items.push(item);
        }
      });
    });
    return items;
  }, [cycle, stateStorage, spaceIndex]);

  const doneItems = useMemo(() => {
    const done = cycleItems.filter((item) => item.status === "done");
    return done.length;
  }, [cycleItems]);

  const progressPercentage = useMemo(() => {
    if (cycleItems.length === 0) return 0;
    const percentage = (doneItems * 100) / cycleItems.length;
    const formattedPercentage =
      percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1);

    return formattedPercentage;
  }, [doneItems, cycleItems]);

  return (
    <div className="w-[17rem] h-[19rem] item bg-transparent">
      <Link
        href={`/${slug}/${space}/active/${cycle._id}`}
        className="h-[19rem] flex flex-col active:scale-100"
      >
        <div className="h-1/2 w-full p-2 bg-transparent">
          <div className="flex items-center gap-4">
            <span className="text-hx text-focus-text">
              {doneItems}/{cycleItems.length} completed
            </span>
            <div className="flex items-center">
              {members.map((member, index) => (
                <UserAvatar
                  key={index}
                  name={member.member.fullName}
                  image={member.member.avatar}
                  index={index}
                  size={5}
                  className="border-dashboard"
                />
              ))}
            </div>
          </div>
          {/* <span className="text-less-highlight text-hx flex items-center gap-1 mt-2">
            <CircleDashed size={16} />
            {progressPercentage}%
          </span> */}
        </div>
        <div className="h-1/2 w-full border-t border-item-border rounded-b-lg p-2 flex flex-col justify-between">
          <h5 className="text-focus-text-hover font-medium text-base">
            {cycle.name}
          </h5>
          {/* <span className="text-xs text-amber-400 py-[2px] px-[6px] bg-amber-800/20 rounded-md w-fit">
            mode: blitz
          </span> */}
          <span className="text-less-highlight text-hx flex items-center gap-1">
            <CircleDashed size={16} />
            {progressPercentage}%
          </span>
          <h6 className="mt-2 text-focus-text-hover text-hx">
            {format(new Date(cycle.startDate), "do MMM yyyy")} -{" "}
            {format(new Date(cycle.endDate), "do MMM yyyy")}
          </h6>
          <p className="text-focus-text">
            {Math.ceil(
              (new Date(cycle.endDate).getTime() - new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days to go
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ActiveCycle;
