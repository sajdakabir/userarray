"use client";

import { CompactSpace } from "@/lib/types/Spaces";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import Link from "next/link";

const EachSpaceSettings = (props: {
  slug: string;
  space: CompactSpace;
  isOpen: boolean;
  activeSection: "general" | "labels" | "archive" | "none";
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(props.isOpen);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full text-focus-text"
    >
      <CollapsibleTrigger className="hover:text-focus-text-hover hover:bg-sidebar-button-hover text-sm flex items-center justify-between rounded-lg px-2 py-1 w-full">
        <p
          className="flex items-center justify-start gap-2 group"
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
        <div className="text-hx my-2 flex flex-col gap-1 mt-2 pl-3">
          <Link
            className={`hover:text-focus-text-hover text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md hover:bg-sidebar-button-hover ${
              props.activeSection === "general"
                ? "bg-sidebar-button-active text-focus-text-hover"
                : ""
            }`}
            href={`/${props.slug}/settings/${props.space._id}`}
          >
            General
          </Link>
          <Link
            className={`hover:text-focus-text-hover text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md hover:bg-sidebar-button-hover ${
              props.activeSection === "labels"
                ? "bg-sidebar-button-active text-focus-text-hover"
                : ""
            }`}
            href={`/${props.slug}/settings/${props.space._id}/labels`}
          >
            Labels
          </Link>
          <Link
            className={`hover:text-focus-text-hover text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md hover:bg-sidebar-button-hover ${
              props.activeSection === "archive"
                ? "bg-sidebar-button-active text-focus-text-hover"
                : ""
            }`}
            href={`/${props.slug}/settings/${props.space._id}/archives`}
          >
            Archive
          </Link>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default EachSpaceSettings;
