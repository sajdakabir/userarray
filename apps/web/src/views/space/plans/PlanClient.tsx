"use client";

import { statuses } from "@/lib/types/Items";
import { dataStore, userStore } from "@/utils/store/zustand";
import { CheckSquare, Circle, Inbox, Orbit, Plus, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CreateItem from "@/components/smalls/items/CreateItem";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ItemCard from "@/components/smalls/items/ItemCard";
import UpcomingCycle from "@/components/smalls/cycle/UpcomingCycle";
import { UpdateItemsState } from "@/utils/state-manager/item-updater";
import { Cycle } from "@/lib/types/Cycle";
import { patchItem } from "@/server/patchers/item-patcher";

const PlanClient = (props: { token: string; slug: string; space: string }) => {
  // Global states
  const setCurrent = userStore((state) => state.setCurrent);
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);
  const dayBoards = dataStore((state) => state.dayBoards);
  // calculations
  const spaceIndex = useMemo<number>(() => {
    if (!stateStorage) return 0;
    const spc_index = stateStorage.spaces.findIndex(
      (space) => space.name === props.space
    );
    return spc_index;
  }, [stateStorage, props.space]);

  const current = useMemo<Cycle | undefined>(() => {
    if (!stateStorage) return;
    return stateStorage.spaces[spaceIndex].cycles.current;
  }, [stateStorage, spaceIndex]);

  const upcoming = useMemo<Cycle[]>(() => {
    if (!stateStorage) return [];
    return stateStorage.spaces[spaceIndex].cycles.upcoming;
  }, [stateStorage, spaceIndex]);

  const [inboxItems, todoItems] = useMemo(() => {
    if (!stateStorage) return [[], []];
    const items_ = stateStorage.spaces[spaceIndex].items;
    const items__ = items_.filter((itm) => itm.cycles.length === 0);
    const inbox = items__.filter((item) => item.status === "inbox");
    const todo = items__.filter((item) => item.status === "todo");
    return [inbox, todo];
  }, [stateStorage, spaceIndex]);

  // Local state
  const [inboxOpen, setInboxIsOpen] = useState<boolean>(false);
  const [todoOpen, setTodoIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setCurrent(`${props.space}-plan`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleInboxDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!stateStorage) return;
    const data = e.dataTransfer.getData("text/plain");
    let item = JSON.parse(data);
    if (item.status === "inbox") {
      return;
    }
    item.status = "inbox";
    UpdateItemsState(
      item,
      spaceIndex,
      {
        inbox: stateStorage.inbox,
        today: dayBoards[0].today,
      },
      stateStorage,
      setStateStorage,
      "update"
    );
    await patchItem(item, props.slug, props.space, item.uuid, props.token);
  };

  const handleTodoDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!stateStorage) return;
    const data = e.dataTransfer.getData("text/plain");
    let item = JSON.parse(data);
    if (item.status === "todo") {
      return;
    }
    item.status = "todo";
    UpdateItemsState(
      item,
      spaceIndex,
      {
        inbox: stateStorage.inbox,
        today: dayBoards[0].today,
      },
      stateStorage,
      setStateStorage,
      "update"
    );
    await patchItem(item, props.slug, props.space, item.uuid, props.token);
  };

  if (!stateStorage) return null;

  return (
    <section className="h-screen flex flex-col gap-y-12 flex-grow right-0 bg-dashboard pt-8">
      <div className="mx-20">
        <h2 className="text-xl flex items-center font-medium text-focus-text-hover">
          <Orbit className="mr-2" size={20} />
          Plan
        </h2>
        <h4 className="text-focus-text text-sm mt-2 flex items-center">
          All your work items: your playground from where you push things to be
          executed.
        </h4>
      </div>

      <div className="flex flex-row overflow-hidden ml-16">
        <div className="text-sm flex justify-start gap-x-10 pr-8">
          <div
            onDrop={handleInboxDrop}
            onDragOver={handleDragOver}
            className="w-[295px] flex flex-col"
          >
            <div className="flex items-center justify-between px-4">
              <h4 className="flex items-center gap-1 text-focus-text-hover font-semibold">
                <Inbox size={16} className="mr-1 text-highlight" />
                Inbox
                <span className="text-nonfocus-text font-normal">
                  {inboxItems.length} tasks
                </span>
              </h4>

              <Dialog open={inboxOpen} onOpenChange={setInboxIsOpen}>
                <DialogTrigger
                  className="outline-none focus:outline-none"
                  asChild={true}
                >
                  <button className="text-focus-text-hover rounded-md hover:bg-sidebar p-1">
                    <Plus size={16} />
                  </button>
                </DialogTrigger>
                <CreateItem
                  token={props.token}
                  status={statuses[0]}
                  isPlan
                  space={stateStorage.spaces[spaceIndex]}
                  setIsOpen={setInboxIsOpen}
                />
              </Dialog>
            </div>

            {inboxItems.length !== 0 ? (
              <div className="flex flex-col gap-y-2 mt-6 pt-2 mb-1 pb-4 overflow-hidden hover:overflow-y-auto px-4 overflow-x-hidden">
                {inboxItems.map((task) => (
                  <ItemCard
                    compact
                    key={task.uuid}
                    token={props.token}
                    item={task}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 text-focus-text text-sm ml-4">
                You don&apos;t have any inbox items yet
              </div>
            )}
          </div>
          <div
            onDrop={handleTodoDrop}
            onDragOver={handleDragOver}
            className="w-[295px] flex flex-col"
          >
            <div className="flex items-center justify-between px-4">
              <h4 className="flex items-center gap-1 text-focus-text-hover font-semibold">
                <CheckSquare size={16} className="mr-1 text-less-highlight" />
                Todo{" "}
                <span className="text-nonfocus-text font-normal">
                  {todoItems.length} tasks
                </span>
              </h4>
              <Dialog open={todoOpen} onOpenChange={setTodoIsOpen}>
                <DialogTrigger
                  className="outline-none focus:outline-none"
                  asChild={true}
                >
                  <button className="text-focus-text-hover rounded-md hover:bg-sidebar p-1">
                    <Plus size={16} />
                  </button>
                </DialogTrigger>
                <CreateItem
                  token={props.token}
                  status={statuses[1]}
                  isPlan
                  space={stateStorage.spaces[spaceIndex]}
                  setIsOpen={setTodoIsOpen}
                />
              </Dialog>
            </div>

            {todoItems.length !== 0 ? (
              <div className="flex flex-col gap-y-2 mt-6 pt-2 mb-1 pb-4 overflow-hidden hover:overflow-y-auto px-4 overflow-x-hidden">
                {todoItems.map((task) => (
                  <ItemCard key={task.uuid} token={props.token} item={task} />
                ))}
              </div>
            ) : (
              <div className="mt-8 text-focus-text text-sm ml-4">
                You don&apos;t have any todo items yet
              </div>
            )}
          </div>
        </div>

        <div className="w-[1px] bg-divider mb-8 min-h-96" />

        <div className="text-sm w-1/3 px-8 ml-4">
          <div className="max-w-64 flex flex-col gap-y-6">
            <h4 className="flex items-center gap-x-2 text-focus-text-hover font-semibold">
              <Zap className="text-highlight" size={16} />
              This Week
            </h4>

            {current ? (
              <UpcomingCycle
                cycle={current}
                token={props.token}
                space={props.space}
                spaceIndex={spaceIndex}
              />
            ) : (
              <p className="text-focus-text text-sm mb-16">No active cycle</p>
            )}

            <h4 className="flex items-center gap-x-2 text-focus-text-hover font-semibold">
              <Circle className="text-less-highlight" size={16} />
              Upcoming
            </h4>

            {upcoming.length !== 0 ? (
              <div className="flex flex-col gap-y-4">
                {upcoming.map((cycle) => (
                  <UpcomingCycle
                    key={cycle.uuid}
                    cycle={cycle}
                    token={props.token}
                    space={props.space}
                    spaceIndex={spaceIndex}
                  />
                ))}
              </div>
            ) : (
              <p className="text-focus-text text-sm mb-16">
                No upcoming cycles
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanClient;
