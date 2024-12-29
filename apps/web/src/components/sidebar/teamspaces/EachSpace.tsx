"use client";

import { CompactSpace } from "@/lib/types/Spaces";
import { ChevronDown, Zap, Archive, Orbit, Route } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import Link from "next/link";
import { userStore } from "@/utils/store/zustand";

const EachSpace = (props: { space: CompactSpace; isOpen: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);
  const slug = userStore((state) => state.slug);
  const active = userStore((state) => state.current);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full text-focus-text"
    >
      <CollapsibleTrigger className="hover:bg-sidebar-button-active hover:shadow-sm hover:shadow-bg-gradient-dark flex items-center justify-between rounded-lg px-2 py-1 w-full">
        <p
          className="flex items-center text-sm justify-start gap-2 group"
          data-state={isOpen ? "open" : "closed"}
        >
          <ChevronDown
            className="transition-transform duration-300 group-data-[state=open]:rotate-180"
            size={18}
          />
          {props.space.name}
        </p>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="flex flex-col mt-2 pl-3 gap-[2px]">
          <Link
            href={`/${slug}/${props.space.name}/active`}
            className={`${
              active === props.space.name + "-cycle"
                ? "bg-sidebar-button-active text-focus-text-hover"
                : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
            }  text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md`}
          >
            <Zap size={14} />
            Active
          </Link>
          <Link
            href={`/${slug}/${props.space.name}/plan`}
            className={`${
              active === props.space.name + "-plan"
                ? "bg-sidebar-button-active text-focus-text-hover"
                : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
            }  text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md`}
          >
            <Orbit size={14} />
            Plan
          </Link>
          {/* <Link
            href={`/${slug}/${props.space.name}/roadmap`}
            className={`${
              active === props.space.name + "-roadmap"
                ? "bg-sidebar-button-active text-focus-text-hover"
                : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
            }  text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md`}
          >
            <Route size={14} />
            Roadmap
          </Link> */}
          {/* <Link
            href={`/${slug}/${props.space.name}/archive`}
            className={`${
              active === props.space.name + "-archive"
                ? "bg-sidebar-button-active text-focus-text-hover"
                : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
            } text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md`}
          >
            <Archive size={14} />
            Archive
          </Link> */}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EachSpace;
