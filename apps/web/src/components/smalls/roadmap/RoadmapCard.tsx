import { FileText } from "lucide-react";
import React from "react";
import Link from "next/link";
import { userStore } from "@/utils/store/zustand";
import { Roadmap } from "@/lib/types/Roadmap";

type CardProps = {
  pop: Roadmap;
  done: number;
  space: string;
  total: number;
};

const RoadmapCard: React.FC<CardProps> = ({ pop, done, total, space }) => {
  const slug = userStore((state) => state.slug);
  
  return (
    <Link href={`/${slug}/${space}/roadmap/${pop.sequenceId}`}>
      <div className="h-[5.5rem] item w-64 p-4 flex flex-col justify-between">
        <div className="flex items-center gap-x-1">
          <FileText size={18} className="mr-1 text-highlight" />
          <p className="text-focus-text-hover">{pop.name}</p>
        </div>

        <div className="text-xs">
          {done} / {total} work items
        </div>
      </div>
    </Link>
  );
};

export default RoadmapCard;
