import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Cycle } from "@/lib/types/Cycle";
import { dataStore } from "@/utils/store/zustand";
import { Zap } from "lucide-react";
import { FC } from "react";
import CycleSelectorContent from "./CycleSelectorContent";

type CycleSelectorProps = {
  cycles: Cycle[];
  allCycles: Cycle[];
  setCycles: (cycles: Cycle[]) => void;
};

const CycleSelector: FC<CycleSelectorProps> = ({
  cycles,
  allCycles,
  setCycles,
}) => {
  const stateStorage = dataStore((state) => state.stateStorage);

  if (!stateStorage) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="border text-xs border-item-border text-focus-text hover:bg-gray-600/30 hover:text-focus-text-hover px-2 py-1 rounded-md flex items-center justify-start gap-x-1">
          <Zap size={14} />
          {cycles.length === 0 ? (
            <p className="capitalize">Cycles</p>
          ) : (
            <div>{cycles[0].name}</div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-sidebar rounded-[10px] p-1 text-focus-text border-sidebar-button-active w-fit min-w-24">
        <CycleSelectorContent
          cycles={allCycles}
          selected={cycles}
          setCycles={setCycles}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CycleSelector;
