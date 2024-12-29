import { StateSpace } from "@/lib/types/States";
import { dataStore } from "@/utils/store/zustand";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Check, Divide } from "lucide-react";

type SpaceSelectorProps = {
  space: StateSpace;
  setSpace: (space: StateSpace) => void;
};

const SpaceSelector: React.FC<SpaceSelectorProps> = ({ space, setSpace }) => {
  const stateStorage = dataStore((state) => state.stateStorage);

  if (!stateStorage) return null;
  const spaces = stateStorage.spaces;

  return (
    <Popover>
      <PopoverTrigger>
        <div className="border text-xs border-item-border text-focus-text hover:bg-gray-600/30 hover:text-focus-text-hover px-2 py-1 rounded-md w-fit grid place-content-center">
          {space.identifier}
        </div>
      </PopoverTrigger>
      <PopoverContent className="bg-sidebar mt-2 ml-12 rounded-[10px] p-1 text-focus-text border-sidebar-button-active w-fit min-w-24">
        <div className="flex flex-col gap-[2px]">
          {spaces.map((spc) => (
            <PopoverClose
              key={spc._id}
              onClick={() => {
                setSpace(spc);
              }}
              className={`text-xs group py-1 pl-2 pr-4 rounded-md text-left w-full hover:bg-sidebar-button-hover hover:text-focus-text-hover`}
            >
              <span className="flex items-center">
                {spc._id === space._id ? (
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
                {spc.name}
              </span>
            </PopoverClose>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SpaceSelector;
