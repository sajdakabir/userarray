"use client";

import { Item, Status, efforts, statuses } from "@/lib/types/Items";
import { userStore, dataStore } from "@/utils/store/zustand";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Label } from "@/lib/types/Labels";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import AssigneeSelector from "@/components/smalls/items/selector/AssigneeSelector";
import StatusSelector from "@/components/smalls/items/selector/StatusSelector";
import { DatePicker } from "@/components/ui/date-picker";
import LabelSelector from "@/components/smalls/items/selector/LabelSelector";
import { ArrowLeft } from "lucide-react";
import CycleSelector from "@/components/smalls/items/selector/CycleSelector";
import {
  UpdateItem,
  UpdateItemsState,
} from "@/utils/state-manager/item-updater";
import { Cycle } from "@/lib/types/Cycle";
import { TextEditor } from "@/components/smalls/editor/RichEditor";
import { findCycle, formattedDate } from "@/utils/helpers";
import { patchItem } from "@/server/patchers/item-patcher";
import ItemActivitySection from "@/components/activity/ItemActivitySection";

const ItemClient = (props: { token: string; space: string; id: string }) => {
  // Global states
  const setCurrent = userStore((state) => state.setCurrent);
  const slug = userStore((state) => state.slug);
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);
  const dayBoards = dataStore((state) => state.dayBoards);

  const spcIndex = useMemo(
    () => stateStorage!.spaces.findIndex((spce) => spce.name === props.space),
    [props.space, stateStorage]
  );
  const spc = stateStorage!.spaces[spcIndex];
  const usableCycles = useMemo<Cycle[]>(() => {
    return [spc!.cycles.current, ...spc!.cycles.upcoming];
  }, [spc]);
  const thisItem = useMemo(
    () => spc!.items.find((itm) => itm._id === props.id),
    [props.id, spc]
  );
  const itemMembers = useMemo(() => {
    return stateStorage!.members.filter((d) =>
      thisItem!.assignees.includes(d.member._id)
    );
  }, [thisItem, stateStorage]);

  const itemLabels = useMemo(() => {
    if (!stateStorage || !thisItem) return [];
    return stateStorage.spaces[spcIndex].labels.filter((l) =>
      thisItem.labels.includes(l._id)
    );
  }, [thisItem, stateStorage, spcIndex]);

  const thisCycle = useMemo<Cycle | undefined>(() => {
    if (!stateStorage || !thisItem) return undefined;
    if (thisItem.cycles.length === 0) return undefined;
    return findCycle(stateStorage.spaces[spcIndex].cycles, thisItem.cycles[0]);
  }, [thisItem, spcIndex, stateStorage]);

  const [statusIndex, effortIndex] = useMemo(() => {
    const statusIndex = statuses.findIndex(
      (status) => status.value === thisItem!.status
    );
    const effortIndex = efforts.findIndex(
      (prio) => prio.value === thisItem!.effort
    );
    return [statusIndex, effortIndex];
  }, [thisItem]);

  // Local States
  const [item, setItem] = useState<Item>(thisItem!);
  const [selLabels, setLabels] = useState<Label[]>(itemLabels);
  const [cycles, setCycles] = useState<Cycle[]>(thisCycle ? [thisCycle] : []);
  const [dueDate, setDueDate] = useState(
    thisItem!.dueDate ? new Date(thisItem!.dueDate) : undefined
  );

  const [itemStatus, setStatus] = useState<Status>(statuses[statusIndex]);
  const [itemEffort, setEffort] = useState<Status>(efforts[effortIndex]);
  const [members, setMembers] = useState<WorkspaceMember[]>(itemMembers);

  useEffect(() => {
    setCurrent("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stateStorage) return null;

  const handleTitleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") return;
    const newItem = await patchItem(
      {
        name: e.target.value,
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      setItem(newItem);
      UpdateItemsState(
        newItem,
        spcIndex,
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

  const handleDescription = async (text: string) => {
    const newItem = await patchItem(
      {
        description: text,
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      setItem(newItem);
      UpdateItemsState(
        newItem,
        spcIndex,
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

  const handleDueDateChange = async (date: Date | undefined) => {
    setDueDate(date);
    await UpdateItem(
      {
        dueDate: date ? formattedDate(date) : null,
      },
      spcIndex,
      stateStorage,
      setStateStorage,
      slug,
      item.uuid,
      props.token
    );
  };

  const handleLabelClick = async (newLabels: Label[]) => {
    setLabels(newLabels);
    const newItem = await patchItem(
      {
        labels: newLabels.map((l) => l._id),
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      UpdateItemsState(
        newItem,
        spcIndex,
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
      spcIndex,
      stateStorage,
      setStateStorage,
      slug,
      item.uuid,
      props.token
    );
  };

  const handleStatusClick = async (newStatus: Status) => {
    setStatus(newStatus);
    const newItem = await patchItem(
      {
        status: newStatus.value,
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      UpdateItemsState(
        newItem,
        spcIndex,
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
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      UpdateItemsState(
        newItem,
        spcIndex,
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
      (itemStatus.value === "in progress" || itemStatus.value === "done")
    ) {
      // If user selects no cycle, set status to "todo"
      await handleStatusClick(statuses[1]);
    }
    const newItem = await patchItem(
      {
        cycles: newCycle.map((c) => c._id),
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      setCycles(newCycle);
      UpdateItemsState(
        newItem,
        spcIndex,
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

  return (
    <div className="flex flex-grow">
      <div className="h-screen w-[1px] bg-divider" />
      <section className="min-h-screen overflow-y-auto flex-grow bg-sidebar">
        <div className="min-h-full flex flex-grow items-stretch">
          <div className="min-w-[47rem] max-w-[70%] min-h-full flex flex-col overflow-y-auto justify-between mt-8">
            <div className="">
              <div className="flex items-center">
                <button
                  className="pointer-default ml-6 mr-5 p-[6px] rounded-md hover:bg-sidebar-button-active"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft size={22} className="text-focus-text-hover" />
                </button>
                <div className="text-focus-text text-sm capitalize">
                  <Link
                    className="hover:text-focus-text-hover"
                    href={`/${slug}/${props.space}/active`}
                  >
                    {slug}
                  </Link>{" "}
                  &gt;{" "}
                  <Link
                    className="hover:text-focus-text-hover"
                    href={`/${slug}/${props.space}/plan`}
                  >
                    {props.space}
                  </Link>{" "}
                  &gt;{" "}
                  <span className="hover:text-focus-text-hover">
                    {spc!.identifier} - {item?.sequenceId}
                  </span>
                </div>
              </div>

              <div className="mt-5 ml-20">
                <input
                  type="text"
                  value={item?.name}
                  onChange={(e) => {
                    const _item = { ...item!, name: e.target.value };
                    setItem(_item);
                  }}
                  onBlur={handleTitleBlur}
                  className="text-3xl font-medium text-focus-text-hover border-none bg-transparent px-0"
                />

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      {/* assignees Selector */}
                      <AssigneeSelector
                        selectedMem={members}
                        setSelectedMem={handleAssigneeClick}
                      />

                      {/* Priority Selector */}
                      <StatusSelector
                        status={itemEffort}
                        setStatus={handleEffortClick}
                        statuses={efforts}
                      />

                      {/* Status Selector */}
                      <StatusSelector
                        status={itemStatus}
                        setStatus={handleStatusClick}
                        statuses={
                          cycles.length === 1 ? statuses : statuses.slice(0, 2)
                        }
                      />

                      <DatePicker
                        text="Due"
                        date={dueDate}
                        setDate={handleDueDateChange}
                      />

                      <CycleSelector
                        cycles={cycles}
                        allCycles={usableCycles}
                        setCycles={handleCycleClick}
                      />
                    </div>

                    <div className="z-20">
                      <LabelSelector
                        space={spc!}
                        selLabels={selLabels}
                        setLabels={handleLabelClick}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl mt-10">
                  <TextEditor
                    editable={true}
                    className="[&>.ProseMirror.tiptap]:min-h-[calc(100vh-300px)]"
                    content={item!.description}
                    setContent={handleDescription}
                  />
                </div>
              </div>
            </div>
          </div>

          <ItemActivitySection
            token={props.token}
            space={props.space}
            itemId={item._id}
            item={thisItem}
          />
        </div>
      </section>
    </div>
  );
};

export default ItemClient;
