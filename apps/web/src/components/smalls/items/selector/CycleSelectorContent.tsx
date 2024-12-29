import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Cycle } from "@/lib/types/Cycle";
import { Check, Zap } from "lucide-react";
import { FC } from "react";

type CycleSelectorContentProps = {
  cycles: Cycle[];
  selected: Cycle[];
  setCycles: (cycles: Cycle[]) => void;
};

const CycleSelectorContent: FC<CycleSelectorContentProps> = ({
  cycles,
  selected,
  setCycles,
}) => {
  return (
    <div className="flex flex-col gap-y-[2px]">
      {cycles.map((sta, index) => (
        <DropdownMenuItem
          key={sta._id}
          onClick={() => {
            if (selected.length === 0) {
              setCycles([sta]);
            } else {
              if (selected[0]._id === sta._id) {
                setCycles([]);
              } else {
                setCycles([sta]);
              }
            }
          }}
          className={`text-xs group py-1 px-2 rounded-md text-left w-full hover:bg-sidebar-button-hover hover:text-focus-text-hover`}
        >
          <p className="flex items-center">
            {selected.some((a) => JSON.stringify(a) == JSON.stringify(sta)) ? (
              <Check
                className="mr-2 text-less-highlight"
                size={14}
                strokeWidth={2.5}
              />
            ) : (
              <Check
                className="mr-2 text-nonfocus-text opacity-0 group-hover:opacity-50 duration-150"
                size={14}
              />
            )}
            <Zap
              className={`${
                index === 0 ? "text-highlight" : "text-nonfocus-text"
              } mr-2`}
              size={14}
              strokeWidth={1.5}
            />
            <span className="flex items-center gap-2 capitalize">
               {sta.sequenceId} {" "}{sta.name}
            </span>
          </p>
        </DropdownMenuItem>
      ))}
    </div>
  );
};

export default CycleSelectorContent;
