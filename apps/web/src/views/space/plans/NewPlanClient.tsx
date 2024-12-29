"use client";

import { statuses } from "@/lib/types/Items";
import { dataStore, userStore } from "@/utils/store/zustand";
import { CheckSquare, Circle, Inbox, Orbit, Plus, Zap } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";
import CreateItem from "@/components/smalls/items/CreateItem";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ItemCard from "@/components/smalls/items/ItemCard";
import UpcomingCycle from "@/components/smalls/cycle/UpcomingCycle";
import { UpdateItemsState } from "@/utils/state-manager/item-updater";
import { Cycle } from "@/lib/types/Cycle";
import { patchItem } from "@/server/patchers/item-patcher";

type NewPlanClientProps = {
  token: string;
  slug: string;
  space: string;
};

const NewPlanClient: FC<NewPlanClientProps> = ({ token, slug, space }) => {
  // Global states
  const setCurrent = userStore((state) => state.setCurrent);
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);
  const dayBoards = dataStore((state) => state.dayBoards);
  // calculations
  const spaceIndex = useMemo<number>(() => {
    if (!stateStorage) return 0;
    const spc_index = stateStorage.spaces.findIndex(
      (spac) => spac.name === space
    );
    return spc_index;
  }, [stateStorage, space]);

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
    setCurrent(`${space}-plan`);
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
    await patchItem(item, slug, space, item.uuid, token);
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
    await patchItem(item, slug, space, item.uuid, token);
  };

  if (!stateStorage) return null;

  return (
    <section className="h-screen flex flex-col flex-1 grow right-0 bg-secondary">
      <div className="bg-dashboard border-b border-divider h-12 py-2 px-6 flex items-center justify-between">
        <h2 className="text-lg flex items-center font-medium text-focus-text-hover">
          <Orbit className="mr-2" size={16} />
          Plan
        </h2>
      </div>
    </section>
  );
};

export default NewPlanClient;
