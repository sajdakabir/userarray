import PastCycleItem from "@/components/smalls/items/PastCycleItem";
import { Item } from "@/lib/types/Items";
import { StateSpace } from "@/lib/types/States";
import { CheckCircle2 } from "lucide-react";
import { FC } from "react";

type CompletedCycleProps = {
  doneItems: Item[];
  space: StateSpace;
};

const CompletedCycle: FC<CompletedCycleProps> = ({ doneItems, space }) => {

  return (
    <div className="text-sm mt-12 px-16 flex flex-row flex-1 gap-x-0 overflow-y-auto">
      <div className="min-w-[33rem] flex flex-col">
        <div className="flex items-center justify-between pl-4 pb-4">
          <h4 className="flex flex-grow items-center gap-x-2 text-focus-text-hover font-semibold">
            <CheckCircle2 size={16} className="text-green-500" />
            Done
            <span className="text-nonfocus-text font-normal">
              {doneItems.length} tasks
            </span>
          </h4>
        </div>

        {doneItems.length !== 0 ? (
          <div className="w-[44rem] flex flex-col gap-y-3 mt-4 pt-2 mb-2 pb-6 overflow-hidden hover:overflow-y-auto px-4 overflow-x-hidden">
            {doneItems.map((item) => (
              <PastCycleItem
                key={item.uuid}
                item={item}
                space={space}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-focus-text text-sm ml-4">
            You haven&apos;t completed any task
          </div>
        )}
      </div>
    </div>
  );
};

export default CompletedCycle;
