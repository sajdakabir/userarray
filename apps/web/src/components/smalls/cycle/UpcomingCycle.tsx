import { Cycle } from "@/lib/types/Cycle";
import { CircleDashed } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { dataStore, userStore } from "@/utils/store/zustand";
import { useMemo } from "react";
import { Item } from "@/lib/types/Items";
import { toast } from "@/components/ui/use-toast";
import { UpdateItem } from "@/utils/state-manager/item-updater";
import UserAvatar from "../avatar/UserAvatar";

type UpcomingCycleProps = {
  cycle: Cycle;
  space: string;
  token: string;
  spaceIndex: number;
};

const UpcomingCycle: React.FC<UpcomingCycleProps> = ({
  cycle,
  space,
  token,
  spaceIndex,
}) => {
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);
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

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleItemDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!stateStorage) return;
    const data = e.dataTransfer.getData("text/plain");
    let item: Item = JSON.parse(data);
    await UpdateItem(
      { cycles: [cycle._id] },
      spaceIndex,
      stateStorage,
      setStateStorage,
      slug,
      item.uuid,
      token
    );
    toast({
      title: `Item added to Cycle`,
      description: `${item.name} is successfully added to ${cycle.name} cycle`,
    });
  };

  return (
    <div
      onDrop={handleItemDrop}
      onDragOver={handleDragOver}
      className="w-64 h-32 item"
    >
      <Link
        className="h-32 p-2 flex flex-col active:scale-100 justify-between"
        href={`/${slug}/${space}/active/${cycle._id}`}
      >
        <div className="w-full">
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
                  className="border-item"
                />
              ))}
            </div>
          </div>
        </div>
        <span className="text-less-highlight text-hx flex items-center gap-1">
          <CircleDashed size={16} />
          {progressPercentage} %
        </span>
        <div className="w-full rounded-b-lg">
          <h5 className="text-focus-text-hover font-medium">{cycle.name}</h5>
        </div>
        <div className="flex items-center gap-x-2 text-focus-text">
          {/* <span className="text-xs text-cyan-400 px-1 py-[2px] bg-cyan-800/20 rounded-md w-fit">
            mode: rapid
          </span> */}
          <p className="text-xs">
            {format(new Date(cycle.startDate), "do MMM yyyy")}
          </p>
          -
          <p className="text-xs">
            {format(new Date(cycle.endDate), "do MMM yyyy")}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default UpcomingCycle;
