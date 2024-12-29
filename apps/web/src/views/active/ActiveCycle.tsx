import CreateItem from "@/components/smalls/items/CreateItem";
import NewItemCard from "@/components/smalls/items/NewItemCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Cycle } from "@/lib/types/Cycle";
import { Item, statuses } from "@/lib/types/Items";
import { patchItem } from "@/server/patchers/item-patcher";
import { UpdateItemsState } from "@/utils/state-manager/item-updater";
import { dataStore, userStore } from "@/utils/store/zustand";
import {
  Circle,
  Plus,
  ChevronRightCircle,
  GaugeCircle,
  CheckCircle2,
} from "lucide-react";
import { FC, useState } from "react";

type ActiveCycleProps = {
  token: string;
  space: string;
  thisCycle: Cycle;
  spaceIndex: number;
  inboxItems: Item[];
  inProgressItems: Item[];
  todoItems: Item[];
  doneItems: Item[];
};

const ActiveCycle: FC<ActiveCycleProps> = ({
  token,
  space,
  thisCycle,
  spaceIndex,
  inboxItems,
  inProgressItems,
  todoItems,
  doneItems,
}) => {
  const slug = userStore((state) => state.slug);
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);
  const dayBoards = dataStore((state) => state.dayBoards);

  const [inboxOpen, setInboxIsOpen] = useState<boolean>(false);
  const [todoOpen, setTodoIsOpen] = useState<boolean>(false);
  const [inProgressOpen, setInProgressIsOpen] = useState<boolean>(false);
  const [doneOpen, setDoneIsOpen] = useState<boolean>(false);

  if (!stateStorage) return null;

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleInboxDrop = async (e: React.DragEvent) => {
    e.preventDefault();
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
    await patchItem(item, slug, space, item.uuid, token);
  };

  const handleInProgressDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    let item = JSON.parse(data);
    if (item.status === "in progress") {
      return;
    }
    item.status = "in progress";
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
    await patchItem(item, slug, space, item.uuid, token);
  };

  const handleTodoDrop = async (e: React.DragEvent) => {
    e.preventDefault();
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
    await patchItem(item, slug, space, item.uuid, token);
  };

  const handleDoneDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    let item = JSON.parse(data);
    if (item.status === "done") {
      return;
    }
    item.status = "done";
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
    await patchItem(item, slug, space, item.uuid, token);
  };

  return (
    <div className="text-sm mt-12 px-6 flex flex-row flex-1 gap-x-0 overflow-y-auto">
      <div
        onDragOver={handleDragOver}
        onDrop={handleInboxDrop}
        className="min-w-[295px] flex flex-col"
      >
        <div className="flex items-center justify-between px-4">
          <h4 className="flex items-center gap-2 text-focus-text-hover font-semibold">
            <Circle size={16} className="mr-1 text-less-highlight" />
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
              token={token}
              addCycle={thisCycle}
              status={statuses[0]}
              space={stateStorage.spaces[spaceIndex]}
              setIsOpen={setInboxIsOpen}
            />
          </Dialog>
        </div>

        {inboxItems.length !== 0 ? (
          <div className="flex flex-col gap-y-2 mt-6 pt-2 mb-2 pb-4 overflow-hidden hover:overflow-y-auto px-4 overflow-x-hidden">
            {inboxItems.map((task) => (
              <NewItemCard compact key={task.uuid} token={token} item={task} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-focus-text text-sm ml-4">
            You haven&apos;t completed any task
          </div>
        )}
      </div>

      {/* ======================================================================= */}

      <div
        onDragOver={handleDragOver}
        onDrop={handleTodoDrop}
        className="min-w-[295px] flex flex-col"
      >
        <div className="flex items-center justify-between px-4">
          <h4 className="flex items-center gap-2 text-focus-text-hover font-semibold">
            <ChevronRightCircle size={16} className="mr-1 text-highlight" />
            Todo
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
              token={token}
              addCycle={thisCycle}
              status={statuses[1]}
              space={stateStorage.spaces[spaceIndex]}
              setIsOpen={setTodoIsOpen}
            />
          </Dialog>
        </div>

        {todoItems.length !== 0 ? (
          <div className="flex flex-col gap-y-2 mt-6 pt-2 mb-2 pb-4 overflow-hidden hover:overflow-y-auto px-4 overflow-x-hidden">
            {todoItems.map((task) => (
              <NewItemCard compact key={task.uuid} token={token} item={task} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-focus-text text-sm ml-4">
            You don&apos;t have any inbox items yet
          </div>
        )}
      </div>

      {/* ======================================================================= */}

      <div
        onDragOver={handleDragOver}
        onDrop={handleInProgressDrop}
        className="min-w-[295px] flex flex-col"
      >
        <div className="flex items-center justify-between px-4">
          <h4 className="flex items-center gap-2 text-focus-text-hover font-semibold">
            <GaugeCircle size={16} className="mr-1 text-less-highlight" />
            In Progress
            <span className="text-nonfocus-text font-normal">
              {inProgressItems.length} tasks
            </span>
          </h4>
          <Dialog open={inProgressOpen} onOpenChange={setInProgressIsOpen}>
            <DialogTrigger
              className="outline-none focus:outline-none"
              asChild={true}
            >
              <button className="text-focus-text-hover rounded-md hover:bg-sidebar p-1">
                <Plus size={16} />
              </button>
            </DialogTrigger>
            <CreateItem
              token={token}
              addCycle={thisCycle}
              status={statuses[2]}
              space={stateStorage.spaces[spaceIndex]}
              setIsOpen={setInProgressIsOpen}
            />
          </Dialog>
        </div>

        {inProgressItems.length !== 0 ? (
          <div className="flex flex-col gap-y-2 mt-6 pt-2 mb-2 pb-4 overflow-hidden hover:overflow-y-auto px-4 overflow-x-hidden">
            {inProgressItems.map((task) => (
              <NewItemCard key={task.uuid} token={token} item={task} />
            ))}
          </div>
        ) : (
          <div className="mt-8 text-focus-text text-sm ml-4">
            You don&apos;t have any todo items yet
          </div>
        )}
      </div>

      {/* ======================================================================= */}

      <div
        onDragOver={handleDragOver}
        onDrop={handleDoneDrop}
        className="min-w-[295px] flex flex-col"
      >
        <div className="flex items-center justify-between px-4">
          <h4 className="flex items-center gap-2 text-focus-text-hover font-semibold">
            <CheckCircle2 size={16} className="mr-1 text-green-500" />
            Done
            <span className="text-nonfocus-text font-normal">
              {doneItems.length} tasks
            </span>
          </h4>

          <Dialog open={doneOpen} onOpenChange={setDoneIsOpen}>
            <DialogTrigger
              className="outline-none focus:outline-none"
              asChild={true}
            >
              <button className="text-focus-text-hover rounded-md hover:bg-sidebar p-1">
                <Plus size={16} />
              </button>
            </DialogTrigger>
            <CreateItem
              token={token}
              addCycle={thisCycle}
              status={statuses[3]}
              space={stateStorage.spaces[spaceIndex]}
              setIsOpen={setDoneIsOpen}
            />
          </Dialog>
        </div>

        {doneItems.length !== 0 ? (
          <div className="flex flex-col gap-y-2 mt-6 pt-2 mb-2 pb-4 overflow-hidden hover:overflow-y-auto px-4 overflow-x-hidden">
            {doneItems.map((task) => (
              <NewItemCard compact key={task.uuid} token={token} item={task} />
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

export default ActiveCycle;
