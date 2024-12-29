import { Checkbox } from "@/components/ui/checkbox";
import { Item } from "@/lib/types/Items";
import { dataStore, userStore } from "@/utils/store/zustand";
import { FC, useMemo, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import ItemDialog from "./ItemDialog";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { Zap } from "lucide-react";
import { getStatusColor } from "./GetIcons";
import { findCycle } from "@/utils/helpers";
import { Cycle } from "@/lib/types/Cycle";

type ItemTodoProps = {
  item: Item;
  token: string;
  assignee: boolean;
};

const ItemTodo: FC<ItemTodoProps> = ({ item, token, assignee }) => {
  // Global states
  const stateStorage = dataStore((state) => state.stateStorage);
  const workspaces = dataStore((state) => state.workspaces);
  const buildStateStorage = dataStore((state) => state.buildStateStorage);
  const slug = userStore((state) => state.slug);

  const thisWorkspace = useMemo(() => {
    const w = workspaces.find((ws) => ws._id === item.workspace);
    return w || workspaces[0];
  }, [workspaces, item]);

  const spaceIndex = useMemo(() => {
    if (!stateStorage) return -1;
    return stateStorage.spaces.findIndex((spac) => spac._id === item.space);
  }, [stateStorage, item]);

  const itemMembers = useMemo(() => {
    return stateStorage!.members.filter((d) =>
      item.assignees.includes(d.member._id)
    );
  }, [item, stateStorage]);

  const thisCycle = useMemo<Cycle | undefined>(() => {
    if (!stateStorage) return undefined;
    if (item.cycles.length === 0) return undefined;
    return findCycle(stateStorage.spaces[spaceIndex].cycles, item.cycles[0]);
  }, [item, spaceIndex, stateStorage]);

  // Local states
  const [open, setIsOpen] = useState<boolean>(false);
  const [checked, setCheked] = useState<boolean>(item.status === "done");

  if (!stateStorage) return null;
  const spaces = stateStorage.spaces;
  // indexes

  const handleCheck = async () => {
    const status = checked ? "inbox" : "done";
    setCheked(!checked);
    try {
      await axios.patch(
        USER_WORKSPACE +
          `/${slug}/spaces/${spaces[spaceIndex].name}/items/${item.uuid}`,
        {
          status: status,
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      await buildStateStorage(token, slug, thisWorkspace);
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.message);
    }
  };

  return (
    <div className="text-sm p-3 rounded-lg border border-transparent hover:border-item-border hover:bg-item duration-300 max-w-[30rem]">
      <Dialog open={open} onOpenChange={setIsOpen}>
        <div className="flex gap-x-3">
          <Checkbox
            className="data-[state=checked]:bg-focus-text-hover mt-[2px] data-[state=checked]:text-black border-focus-text-hover"
            checked={checked}
            onCheckedChange={handleCheck}
          />
          <Link
            href={`/${slug}/${spaces[spaceIndex].name}/item/${item._id}`}
            className="grow active:scale-100 duration-0"
          >
            <div
              className={`flex gap-2 ${
                item.name.length > 20 ? "flex-col" : "flex-row items-center"
              }`}
            >
              <div
                id="head"
                className="flex items-center gap-x-2 justify-start cursor-default"
              >
                <p className="text-focus-text-hover">{item.name}</p>
              </div>
              <div
                id="others"
                className="flex items-center gap-x-2 justify-start *:cursor-default"
              >
                {assignee && (
                  <div className="text-xs">
                    {itemMembers.map((asgn, index) => (
                      <span key={index}>
                        {index == 0 ? "" : ", "}@
                        {asgn.member.userName || asgn.member.fullName}
                      </span>
                    ))}
                  </div>
                )}
                <span
                  className={`capitalize text-xs ${getStatusColor(
                    item.status
                  )} px-1 py-[1px] rounded-sm text-black`}
                >
                  {item.status}
                </span>
                {thisCycle ? (
                  <div className="text-xs px-1 py-[1px] flex items-center gap-x-1 hover:bg-gray-600/30 rounded-sm border border-divider font-light text-focus-text hover:text-focus-text-hover">
                    <Zap size={12}></Zap> {thisCycle.sequenceId}
                  </div>
                ) : null}
                {/* <span className="text-xs px-1 rounded-sm border border-divider font-light text-nonfocus-text">
                  roadmap - name
                </span> */}
              </div>
            </div>
          </Link>
        </div>
        {/* <ItemDialog
          token={token}
          item={item}
          setIsOpen={setIsOpen}
          spaceName={spaces[spaceIndex].name}
        /> */}
      </Dialog>
    </div>
  );
};

export default ItemTodo;
