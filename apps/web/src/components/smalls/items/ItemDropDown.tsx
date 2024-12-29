import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Ellipsis from "../custom-icons/Ellipsis";
import {
  Archive,
  ChevronRightCircle,
  Route,
  SignalHigh,
  Tag,
  User,
  Zap,
} from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { toast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import { dataStore, userStore } from "@/utils/store/zustand";
import UserAvatar from "../avatar/UserAvatar";
import { Item, SingleItem, Status, efforts, statuses } from "@/lib/types/Items";
import { StateSpace } from "@/lib/types/States";
import LabelSelectorContent from "./selector/LabelSelectorContent";
import { Label } from "@/lib/types/Labels";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import AssigneeSelectorContent from "./selector/AssigneeSelectorContent";
import { Cycle } from "@/lib/types/Cycle";
import CycleSelectorContent from "./selector/CycleSelectorContent";
import StatusSelectorContent from "./selector/StatusSelectorContent";
import { findCycle } from "@/utils/helpers";
import { UpdateItem, UpdateItemsState } from "@/utils/state-manager/item-updater";
import { patchItem } from "@/server/patchers/item-patcher";

type ItemDrop = {
  token: string;
  space: StateSpace;
  item: Item;
};

const ItemDropDown: FC<ItemDrop> = ({ space, token, item }) => {
  // Global State
  const slug = userStore((state) => state.slug);
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);
  const dayBoards = dataStore((state) => state.dayBoards);

  const itemMembers = useMemo(() => {
    return stateStorage!.members.filter((d) =>
      item.assignees.includes(d.member._id)
    );
  }, [item, stateStorage]);

  const thisCycle = useMemo<Cycle | undefined>(() => {
    if (!stateStorage) return undefined;
    if (item.cycles.length === 0) return undefined;
    return findCycle(space.cycles, item.cycles[0]);
  }, [item, space, stateStorage]);

  const itemLabels = useMemo(() => {
    if (!stateStorage) return [];
    return space.labels.filter((l) => item.labels.includes(l._id));
  }, [item, stateStorage, space]);

  const [staIndex, effortIndex] = useMemo(() => {
    const staIndex = statuses.findIndex(
      (status) => status.value === item.status
    );
    const effortIndex = efforts.findIndex(
      (effort) => effort.value === item.effort
    );
    return [staIndex, effortIndex];
  }, [item]);

  // const [thisItem, setThisItem] = useState<Item>(item);
  const [labels, setLabels] = useState<Label[]>(itemLabels);
  const [members, setMembers] = useState<WorkspaceMember[]>(itemMembers);
  const [cycles, setCycles] = useState<Cycle[]>(thisCycle ? [thisCycle] : []);
  const [status, setStatus] = useState<Status>(statuses[staIndex]);
  const [effort, setEffort] = useState<Status>(efforts[effortIndex]);

  // Tracking state changes
  // useEffect(() => {
  //   let sts = status.value;
  //   if (cycles.length === 0 && (sts === "in progress" || sts === "done")) {
  //     setStatus(statuses[1]);
  //     sts = statuses[1].value;
  //   }
  //   const _item = {
  //     ...item,
  //     labels: labels.map((l) => l._id),
  //     assignees: members.map((m) => m.member._id),
  //     cycles: cycles.map((c) => c._id),
  //     status: sts,
  //     effort: effort ? effort.value : "none",
  //   };
  //   setThisItem(_item);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [labels, members, cycles, status, effort]);

  // Update item when item state changes
  // useEffect(() => {
  //   if (thisItem === item) return;
  //   if (!stateStorage) return;

  //   UpdateItem(
  //     thisItem,
  //     spaceIndex,
  //     stateStorage,
  //     setStateStorage,
  //     slug,
  //     item.uuid,
  //     token
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [thisItem]);

  const spaceIndex = useMemo(() => {
    if (!stateStorage) return -1;
    return stateStorage.spaces.findIndex((s) => s._id === space._id);
  }, [stateStorage, space]);

  if (!stateStorage) return null;

  const handleLabelClick = async (newLabels: Label[]) => {
    setLabels(newLabels);
    const newItem = await patchItem(
      {
        labels: newLabels.map((l) => l._id),
      },
      slug,
      space.name,
      item.uuid,
      token
    );
    if (newItem) {
      UpdateItemsState(
        newItem,
        spaceIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "update"
      );
    }
  };

  const handleAssigneeClick = async (newAssignees: WorkspaceMember[]) => {
    setMembers(newAssignees);
    await UpdateItem(
      {
        assignees: newAssignees.map((a) => a.member._id),
      },
      spaceIndex,
      stateStorage,
      setStateStorage,
      slug,
      item.uuid,
      token
    );
  };

  const handleStatusClick = async (newStatus: Status) => {
    setStatus(newStatus);
    const newItem = await patchItem(
      {
        status: newStatus.value,
      },
      slug,
      space.name,
      item.uuid,
      token
    );
    if (newItem) {
      UpdateItemsState(
        newItem,
        spaceIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "update"
      );
    }
  };

  const handleEffortClick = async (newEffort: Status) => {
    setEffort(newEffort);
    const newItem = await patchItem(
      {
        effort: newEffort.value,
      },
      slug,
      space.name,
      item.uuid,
      token
    );
    if (newItem) {
      UpdateItemsState(
        newItem,
        spaceIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "update"
      );
    }
  };

  const handleCycleClick = async (newCycle: Cycle[]) => {
    if (
      newCycle.length === 0 &&
      (status.value === "in progress" || status.value === "done")
    ) {
      // If user selects no cycle, set status to "todo"
      await handleStatusClick(statuses[1]);
    }
    const newItem = await patchItem(
      {
        cycles: newCycle.map((c) => c._id),
      },
      slug,
      space.name,
      item.uuid,
      token
    );
    if (newItem) {
      setCycles(newCycle);
      UpdateItemsState(
        newItem,
        spaceIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "update"
      );
    }
  };

  const archiveItem = async () => {
    try {
      const { data } = await axios.patch(
        USER_WORKSPACE + `/${slug}/spaces/${space.name}/archive/${item.uuid}`,
        null,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const res = data as SingleItem;
      toast({
        title: "Item archived successfully!",
      });
      UpdateItemsState(
        res.response,
        spaceIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "archive"
      );
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.response?.data || error);
      toast({
        variant: "destructive",
        title: "Could not archive item",
      });
    }
  };

  return (
    <div className="flex flex-col justify-between">
      <div className="flex items-center justify-end">
        <DropdownMenuTrigger className="top-0 right-0 text-focus-text-hover focus:outline-none outline-none opacity-30 group-hover:hover:opacity-100 duration-200">
          <Ellipsis size={20} />
        </DropdownMenuTrigger>
      </div>
      {/* <div className="flex items-center mb-[2px]">
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
      </div> */}
      <DropdownMenuContent className="bg-sidebar cursor-default flex flex-col gap-y-1 text-xs p-1 min-w-36 w-fit rounded-[10px] border border-sidebar-button-active">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Tag size={14} />
            <span>Labels</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <LabelSelectorContent
              labels={space.labels}
              selected={labels}
              onSelect={handleLabelClick}
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ChevronRightCircle size={14} />
            <span>Status</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <StatusSelectorContent
              status={status}
              statuses={cycles.length === 1 ? statuses : statuses.slice(0, 2)}
              setStatus={handleStatusClick}
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <SignalHigh size={14} />
            <span>Effort</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <StatusSelectorContent
              status={effort}
              statuses={efforts}
              setStatus={handleEffortClick}
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <User size={14} />
            <span>Asignees</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <AssigneeSelectorContent
              selectedMem={members}
              setSelectedMem={handleAssigneeClick}
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <div className="h-[1px] w-full bg-sidebar-button-active" />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Zap size={14} />
            <span>Cycle</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <CycleSelectorContent
              cycles={[space.cycles.current, ...space.cycles.upcoming]}
              selected={cycles}
              setCycles={handleCycleClick}
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuItem>
          <Route size={14} />
          <span>Roadmap</span>
        </DropdownMenuItem>

        <div className="h-[1px] w-full bg-sidebar-button-active" />

        <DropdownMenuItem onClick={archiveItem}>
          <Archive size={14} />
          <span>Archive</span>
        </DropdownMenuItem>

        {/* <button className="w-full hover:bg-sidebar-button-hover hover:text-focus-text-hover rounded-md px-2 py-1 text-focus-text text-left flex items-center gap-x-2">
          <Trash2 size={14} />
          <span>Delete</span>
        </button> */}
      </DropdownMenuContent>
    </div>
  );
};

export default ItemDropDown;
