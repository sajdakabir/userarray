import { Item } from "@/lib/types/Items";
import { FC, useMemo, useState } from "react";
import { dataStore, userStore } from "@/utils/store/zustand";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Zap } from "lucide-react";
import { findCycle, truncateString } from "@/utils/helpers";
import { GetPriority, GetSmallStatus } from "./GetIcons";
import { useRouter } from "next/navigation";
import ItemDropDown from "./ItemDropDown";
import { Cycle } from "@/lib/types/Cycle";
import { format } from "date-fns";
import UserAvatar from "../avatar/UserAvatar";

type ItemCardProps = {
  token: string;
  item: Item;
  compact?: boolean;
};

const NewItemCard: FC<ItemCardProps> = ({ token, item, compact }) => {
  // Global states
  const stateStorage = dataStore((state) => state.stateStorage);
  const slug = userStore((state) => state.slug);
  const router = useRouter();

  const spaceIndex = useMemo(() => {
    if (!stateStorage) return -1;
    return stateStorage.spaces.findIndex((space) => space._id === item.space);
  }, [item, stateStorage]);

  const itemMembers = useMemo(() => {
    return stateStorage!.members.filter((d) =>
      item.assignees.includes(d.member._id)
    );
  }, [item, stateStorage]);

  const itemLabels = useMemo(() => {
    if (!stateStorage) return [];
    return stateStorage.spaces[spaceIndex].labels.filter((l) =>
      item.labels.includes(l._id)
    );
  }, [item, stateStorage, spaceIndex]);

  const labelledTitle = useMemo<string>(() => {
    const labels = itemLabels.map((obj) => `[${obj.name}]`).join(" ");
    return `${labels} ${item.name}`;
  }, [item, itemLabels]);

  const thisCycle = useMemo<Cycle | undefined>(() => {
    if (!stateStorage) return undefined;
    if (item.cycles.length === 0) return undefined;
    return findCycle(stateStorage.spaces[spaceIndex].cycles, item.cycles[0]);
  }, [item, spaceIndex, stateStorage]);

  if (!stateStorage) return null;
  const spaces = stateStorage.spaces;
  // Drag operation
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  return (
    <DropdownMenu>
      <div
        draggable={true}
        onDragStart={handleDragStart}
        onClick={() =>
          router.push(`/${slug}/${spaces[spaceIndex].name}/item/${item._id}`)
        }
        className="group flex flex-col item w-64 text-focus-text gap-y-1 px-3 py-2"
      >
        <div className="flex justify-between items-center">
          <span className="text-[10px] text-focus-text uppercase">
            {spaces[spaceIndex].identifier}-{item.sequenceId}
          </span>
          <ItemDropDown token={token} space={spaces[spaceIndex]} item={item} />
        </div>

        <div className="flex justify-between">
          <div className="pt-[2px]">
            <GetSmallStatus value={item.status} />
          </div>
          <div className="flex grow mr-1 max-w-[12.5rem]">
            <p className="font-medium text-focus-text-hover text-hx">
              {labelledTitle}
            </p>
          </div>
        </div>

        <div className="mt-1 flex justify-between grow active:scale-100 duration-0 text-left select-none">
          <div className="ml-[26px] flex justify-between items-center text-focus-text max-w-[12rem]">
            <div
              className={`flex flex-col gap-y-1 text-sm rounded-md opacity-60 group-hover:opacity-100 duration-300`}
            >
              <div className="flex items-center gap-[6px] py-[2px]">
                {item.effort ? (
                  <div className="text-[10px] h-5 leading-none flex items-center gap-x-1 px-1 py-[2px] rounded-sm border border-divider hover:bg-gray-600/30 hover:text-focus-text-hover">
                    <GetPriority value={item.effort} color={"none"} />{" "}
                    {item.effort.charAt(0).toUpperCase()}
                  </div>
                ) : null}
                {thisCycle ? (
                  <div className="text-xs px-1 py-[1px] flex items-center gap-x-1 rounded-sm border border-divider hover:bg-gray-600/30 font-light hover:text-focus-text-hover">
                    <Zap size={12} /> {thisCycle.sequenceId}
                  </div>
                ) : null}
                {/* <div className="text-xs px-1 py-[1px] flex items-center gap-x-1 rounded-sm border border-divider hover:bg-gray-600/30 font-light hover:text-focus-text-hover">
                  roadmap
                </div> */}
              </div>

              {/* TODO: check if it has sub items in place of true */}
              {/* {(true || item.dueDate) && (
                <div className="flex items-center gap-[6px] py-[2px]">
                  <div className="text-[11px] leading-snug text-center px-1 py-[1px] w-fit rounded-sm border border-divider hover:bg-gray-600/30 font-light hover:text-focus-text-hover">
                    2 / 10
                  </div>
                  {item.dueDate && (
                    <div className="text-[11px] px-1 py-[1px] leading-snug w-fit gap-x-1 rounded-sm border border-divider hover:bg-gray-600/30 font-light hover:text-focus-text-hover">
                      {format(new Date(item.dueDate), "MMM do")}
                    </div>
                  )}
                </div>
              )} */}
            </div>
          </div>

          <div className="flex flex-col items-center justify-end gap-x-1">
            <div className="flex items-center justify-end mb-[2px]">
              {itemMembers.map((a, index) => (
                <UserAvatar
                  key={a.member._id}
                  name={a.member.fullName}
                  image={a.member.avatar}
                  index={index}
                  size={5}
                  className="border-item"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DropdownMenu>
  );
};

export default NewItemCard;

{
  /* <div onClick={() => console.log("hello")}>
  <button onClick={(e) => { e.stopPropagation(); console.log("world"); }}>Click me</button>
</div> */
}
