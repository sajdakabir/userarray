import { Cycle } from "@/lib/types/Cycle";
import { Item } from "@/lib/types/Items";
import { dataStore, userStore } from "@/utils/store/zustand";
import { format } from "date-fns";
import { useMemo } from "react";
import Link from "next/link";

type CompletedCycleProps = {
  cycle: Cycle;
  space: string;
  spaceIndex: number;
};

const CompletedCycle: React.FC<CompletedCycleProps> = ({
  cycle,
  space,
  spaceIndex,
}) => {
  const stateStorage = dataStore((state) => state.stateStorage);
  const slug = userStore((state) => state.slug);
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

  if (!stateStorage) return null;

  return (
    <div className="item h-12 px-4 text-sm w-80 rounded-lg">
      <Link href={`/${slug}/${stateStorage.spaces[spaceIndex].name}/active/${cycle._id}`}>
        <div className="flex items-center justify-between h-12">
          <span className="font-medium text-focus-text-hover cursor-default">
            {cycle.name}
          </span>
          <span className="text-xs cursor-default">
            {doneItems}/{cycleItems.length}
          </span>
          <span className="text-xs cursor-default">
            {format(new Date(cycle.startDate), "MMM do")} -{" "}
            {format(new Date(cycle.endDate), "MMM do")}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default CompletedCycle;
