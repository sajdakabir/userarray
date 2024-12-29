import { Label } from "@/lib/types/Labels";
import { FC } from "react";
import { userStore } from "@/utils/store/zustand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tag } from "lucide-react";
import Link from "next/link";
import LabelSelectorContent from "./LabelSelectorContent";
import { StateSpace } from "@/lib/types/States";

type LabelSelectorProps = {
  space: StateSpace;
  selLabels: Label[];
  setLabels: (labels: Label[]) => void;
};

const LabelSelector: FC<LabelSelectorProps> = ({
  space,
  selLabels,
  setLabels,
}) => {
  const slug = userStore((state) => state.slug);
  const labels = space.labels;

  return (
    <DropdownMenu>
      {labels.length !== 0 ? (
        <>
          <DropdownMenuTrigger className="flex items-center gap-x-2 active:scale-100">
            {selLabels.map((label) => {
              const opacity = `${label.color}21`;
              const labelStyle = {
                backgroundColor: opacity,
                color: label.color,
                // borderColor: `${label.color}`,
              };
              return (
                <div
                  className="px-2 py-1 text-xs rounded-md cursor-default"
                  style={labelStyle}
                  key={label._id}
                >
                  {label.name}
                </div>
              );
            })}
            <div className="border px-[6px] text-xs flex items-center justify-center border-item-border text-focus-text hover:bg-gray-600/30 hover:text-focus-text-hover p-1 rounded-md w-fit">
              <Tag size={14} />
              <span
                className={`ml-1 ${selLabels.length > 0 ? "hidden" : "flex"}`}
              >
                Labels
              </span>
            </div>
          </DropdownMenuTrigger>
        </>
      ) : (
        <Link
          className="border text-xs border-item-border text-focus-text hover:bg-gray-600/30 hover:text-focus-text-hover px-2 py-1 rounded-md w-fit"
          href={`/${slug}/settings/${space._id}/labels`}
        >
          Create Label
        </Link>
      )}
      <DropdownMenuContent className="bg-sidebar w-fit flex flex-col shadow-md shadow-black/30 mt-2 rounded-[10px] p-1 text-focus-text border border-sidebar-button-active">
        <LabelSelectorContent
          labels={labels}
          selected={selLabels}
          onSelect={setLabels}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LabelSelector;
