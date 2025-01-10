"use client";

import { Zap, Orbit } from "lucide-react";

import Link from "next/link";
import { userStore } from "@/utils/store/zustand";
import { StateTeam } from "@/lib/types/Teams";

const EachSpace = (props: {
  space: StateTeam;
  key: string;
  workspace: string;
}) => {
  const active = userStore((state) => state.current);

  return (
    <div className="flex  mt-2 pl-3 gap-[2px]">
      <Link
        href={`/${props.workspace}/${props.space._id}/cycle`}
        className={`${
          active === props.space.name + "-cycle"
            ? "bg-sidebar-button-active text-focus-text-hover"
            : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
        }  text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider`}
      >
        <Zap size={14} />
        Cycle
      </Link>
      <Link
        href={`/${props.workspace}/${props.space._id}/plan`}
        className={`${
          active === props.space.name + "-plan"
            ? "bg-sidebar-button-active text-focus-text-hover"
            : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
        }  text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider`}
      >
        <Orbit size={14} />
        Plan
      </Link>
    </div>
  );
};

export default EachSpace;
