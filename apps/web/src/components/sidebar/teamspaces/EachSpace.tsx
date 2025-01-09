"use client";

import { ChevronDown, Zap, Archive, Orbit, Route } from "lucide-react";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "@/components/ui/collapsible";
import { useState } from "react";
import Link from "next/link";
import { userStore } from "@/utils/store/zustand";
import { StateTeam } from "@/lib/types/Teams";

const EachSpace = (props: { space: StateTeam;key:string }) => {
  const slug = userStore((state) => state.slug);
  const active = userStore((state) => state.current);
  
  
  return (
    // <Collapsible
    //   // open={isOpen}
    //   // onOpenChange={setIsOpen}
    //   className="w-full text-focus-text"
    // >
    //   <CollapsibleTrigger className="border border-transparent hover:border-divider hover:bg-sidebar-button-active hover:shadow-md hover:shadow-black/30 flex items-center justify-between rounded-lg px-2 py-1 w-full">
    //     <p
    //       className="flex items-center text-sm justify-start gap-2 group"
        
    //     >
    //       <ChevronDown
    //         className="transition-transform duration-300 group-data-[state=open]:rotate-180"
    //         size={18}
    //       />
    //       {props.space.name}
    //     </p>
    //   </CollapsibleTrigger>

     
     
    // </Collapsible>
        <div className="flex  mt-2 pl-3 gap-[2px]">
          <Link
            href={`/${slug}/${props.space._id}/cycle`}
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
            href={`/${slug}/${props.space._id}/plan`}
            className={`${
              active === props.space.name + "-plan"
                ? "bg-sidebar-button-active text-focus-text-hover"
                : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
            }  text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider`}
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
  );
};

export default EachSpace;
