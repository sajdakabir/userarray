import { Item } from "@/lib/types/Items";
import { StateSpace } from "@/lib/types/States";
import { FC, useMemo } from "react";
import { GetPriority, GetSmallStatus } from "./GetIcons";
import UserAvatar from "../avatar/UserAvatar";
import { dataStore, userStore } from "@/utils/store/zustand";
import { format } from "date-fns";
import Link from "next/link";

type PastCycleItemProps = {
  item: Item;
  space: StateSpace;
};

const PastCycleItem: FC<PastCycleItemProps> = ({ item, space }) => {
  const slug = userStore((state) => state.slug);
  const stateStorage = dataStore((state) => state.stateStorage);

  const itemMembers = useMemo(() => {
    if (!stateStorage) return [];
    return stateStorage.members.filter((d) =>
      item.assignees.includes(d.member._id)
    );
  }, [item, stateStorage]);

  const itemLabels = useMemo(() => {
    return space.labels.filter((l) => item.labels.includes(l._id));
  }, [item, space]);

  return (
    <Link href={`/${slug}/${space.name}/item/${item._id}`} className="active:scale-100">
      <div className="item hover:scale-100 flex items-center justify-between text-focus-text p-3">
        <div className="flex items-center gap-x-2">
          <p className="uppercase text-xs w-fit mr-1">
            {space.identifier}-{item.sequenceId}
          </p>
          <p className="text-focus-text-hover">
            <GetSmallStatus value={item.status} />
          </p>
          <p className="text-focus-text-hover font-medium">{item.name}</p>
          <div className="flex items-center gap-x-1">
            {itemLabels.map((label) => {
              const opacity = `${label.color}21`;
              const labelStyle = {
                backgroundColor: opacity,
                color: label.color,
              };
              return (
                <div
                  className="px-[6px] py-[3px] text-xs rounded-md cursor-default"
                  style={labelStyle}
                  key={label._id}
                >
                  {label.name}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-x-[6px]">
          {item.effort ? (
            <div className="text-[10px] h-5 leading-none flex items-center gap-x-1 px-1 py-[2px] rounded-sm border border-divider hover:bg-gray-600/30 hover:text-focus-text-hover">
              <GetPriority value={item.effort} color={"none"} />{" "}
              {item.effort.charAt(0).toUpperCase()}
            </div>
          ) : null}
          <div className="flex items-center mb-[2px]">
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
          <p className="text-xs">
            {item.dueDate && format(new Date(item.dueDate), "MMM do")}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default PastCycleItem;
