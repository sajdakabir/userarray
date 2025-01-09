'use client'
import { Item } from "@/lib/types/Items";
import { FC, useMemo, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { dataStore, userStore } from "@/utils/store/zustand";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Zap } from "lucide-react";
import { findCycle, truncateString } from "@/utils/helpers";
import { GetPriority, GetStatus } from "./GetIcons";
import { useRouter } from "next/navigation";
import ItemDialog from "./ItemDialog";
import ItemDropDown from "./ItemDropDown";
import { Cycle } from "@/lib/types/Cycle";
import { Issue } from "@/lib/types/Issue";

type ItemCardProps = {
  // token: string;
  item: Issue;
  compact?: boolean;
};

const ItemCard: FC<ItemCardProps> = ({  item, compact }) => {
 
//   const stateStorage = dataStore((state) => state.stateStorage);
//   const slug = userStore((state) => state.slug);
//   // Local states
//   const [open, setIsOpen] = useState<boolean>(false);
//  console.log("item",item);
 
//   const router = useRouter();

  // const [textColor, bgColor] = useMemo<[string, string]>(() => {
  //   let color = "text-red-600";
  //   let bgColor = "bg-red-800/20";
  //   if (item.effort === "none") {
  //     color = "text-white";
  //     bgColor = "bg-white/20";
  //   } else if (item.effort === "low") {
  //     color = "text-cyan-400";
  //     bgColor = "bg-cyan-800/20";
  //   } else if (item.effort === "medium") {
  //     color = "text-amber-400";
  //     bgColor = "bg-amber-800/20";
  //   } else if (item.effort === "high") {
  //     color = "text-purple-500";
  //     bgColor = "bg-purple-800/20";
  //   }
  //   return [color, bgColor];
  // }, [item]);

  // const spaceIndex = useMemo(() => {
  //   if (!stateStorage) return -1;
  //   // return stateStorage.spaces.findIndex((space) => space._id === item.space);
  // }, [item, stateStorage]);

  // const thisCycle = useMemo<Cycle | undefined>(() => {
  //   if (!stateStorage) return undefined;
  //   // if (item.cycles.length === 0) return undefined;
  //   // return findCycle(stateStorage.spaces[spaceIndex].cycles, item.cycles[0]);
  // }, [item, spaceIndex, stateStorage]);

  // if (!stateStorage) return null;
  // const spaces = stateStorage.spaces;
  // // Drag operation
  // const handleDragStart = (e: React.DragEvent) => {
  //   e.dataTransfer.setData("text/plain", JSON.stringify(item));
  // };

  return (
    <DropdownMenu>
      <Dialog 
      // open={open} onOpenChange={setIsOpen}
      >
        <div
          draggable={true}
          // onDragStart={handleDragStart}
          className="group flex flex-row item w-64 text-focus-text gap-3 px-3 py-2"
        >
          <GetStatus value={item.state.name} />

          <div
            // onClick={() =>
            //   router.push(
            //     `/${slug}/${spaces[spaceIndex].name}/item/${item._id}`
            //   )
            // }
            className="grow active:scale-100 duration-0"
          >
            <div className="text-left select-none">
              <p className="font-medium text-focus-text-hover text-hx">
                {item.title}
              </p>

              <>
                {item && item.description && item.description !== "<p></p>" ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: truncateString(item.description, 22),
                    }}
                    className="text-hx text-focus-text"
                  />
                ) : (
                  <span className="text-hx text-focus-text line-through">
                    No description
                  </span>
                )}
              </>

              <div className="mt-2 flex justify-between items-center text-focus-text">
                <div
                  className={`flex items-center gap-1 px-[6px] py-[2px] text-sm rounded-md opacity-70 group-hover:opacity-100 duration-300`}
                >
                  {item.priority ? (
                    <div className="text-[10px] h-5 leading-none flex items-center gap-x-1 px-1 py-[2px] rounded-sm border border-divider hover:bg-gray-600/30 hover:text-focus-text-hover">
                      <GetPriority value={item.priority} color={"none"} />{" "}
                      {/* {item.effort.charAt(0).toUpperCase()} */}
                      {item.priority}
                    </div>
                  ) : null}
                  {/* {thisCycle ? (
                    <div className="text-xs px-1 py-[1px] flex items-center gap-x-1 rounded-sm border border-divider hover:bg-gray-600/30 font-light hover:text-focus-text-hover">
                      <Zap size={12} /> {thisCycle.sequenceId}
                    </div>
                  ) : null} */}
                </div>
                <span className="text-xs text-focus-text">
                  {/* {spaces[spaceIndex].identifier}-{item.sequenceId} */}
                </span>
              </div>
            </div>
          </div>
          {/* <ItemDropDown token={token} space={spaces[spaceIndex]} item={item} /> */}
        </div>

        {/* <ItemDialog
          token={token}
          item={item}
          setIsOpen={setIsOpen}
          spaceName={spaces[spaceIndex].name}
        /> */}
      </Dialog>
    </DropdownMenu>
  );
};

export default ItemCard;