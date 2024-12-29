"use client";

import { Cycle } from "@/lib/types/Cycle";
import { dataStore, userStore } from "@/utils/store/zustand";
import { useMemo } from "react";
import Link from "next/link";
import { Pin } from "lucide-react";
import { StateSpace } from "@/lib/types/States";

const Pinned = () => {
  const stateStorage = dataStore((state) => state.stateStorage);
  const current = userStore((state) => state.current);
  const slug = userStore((state) => state.slug);

  const { actives, spaces } = useMemo(() => {
    if (!stateStorage) return { actives: [], spaces: [] };
    let actives: Cycle[] = [];
    let spaces: StateSpace[] = [];
    stateStorage.spaces.forEach((space) => {
      if (space.cycles.current !== undefined) {
        actives.push(space.cycles.current);
        spaces.push(space);
      }
    });
    return { actives, spaces };
  }, [stateStorage]);

  if (!stateStorage || stateStorage.spaces.length === 0) return null;

  return (
    <div className="w-full">
      <p className="text-xs my-2 mx-2 flex items-center justify-between text-nonfocus-text">
        <span>Pinned</span>
      </p>

      <div className="flex flex-col gap-[2px] w-full pr-2 pl-3">
        {actives.map((active, index) => (
          <Link
            key={active._id}
            className={`${
              current === `${active.name}-${active.space}`
                ? "bg-sidebar-button-active text-focus-text-hover"
                : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
            } group text-hx text-focus-text flex items-center gap-2 justify-start px-2 py-1 rounded-md`}
            href={`/${slug}/${spaces[index].name}/active/${active._id}`}
          >
            <Pin size={14} className="rotate-45" /> {active.name}
            <span className="text-nonfocus-text text-[11px] capitalize opacity-0 group-hover:opacity-100 duration-300">
              {spaces[index].name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Pinned;
