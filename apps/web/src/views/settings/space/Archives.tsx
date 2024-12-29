"use client";

import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import ArchivedItem from "@/components/smalls/items/ArchivedItem";
import { useToast } from "@/components/ui/use-toast";
import { Cycle } from "@/lib/types/Cycle";
import { Item, SingleItem } from "@/lib/types/Items";
import { getMyItems } from "@/server/fetchers/items/get-workitems";
import { UpdateItemsState } from "@/utils/state-manager/item-updater";
import { dataStore, userStore } from "@/utils/store/zustand";
import CompletedCycle from "@/components/smalls/cycle/CompletedCycle";
import axios, { AxiosError } from "axios";
import { Archive, ListTodo, Zap } from "lucide-react";
import { FC, useEffect, useMemo, useState } from "react";

type ArchivesProps = {
  token: string;
  spaceId: string;
  slug: string;
};

const Archives: FC<ArchivesProps> = ({ token, spaceId, slug }) => {
  // Global states
  const setCurrent = userStore((state) => state.setCurrent);
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);

  const [spcIndex, spc] = useMemo(() => {
    if (!stateStorage) return [0, null];
    const index = stateStorage.spaces.findIndex(
      (state) => state._id === spaceId
    );
    return [index, stateStorage.spaces[index]];
  }, [stateStorage, spaceId]);

  const past = useMemo<Cycle[]>(() => {
    if (!stateStorage) return [];
    return stateStorage.spaces[spcIndex].cycles.completed;
  }, [stateStorage, spcIndex]);

  // Local state
  const [items, setItems] = useState<Item[]>(spc!.archived);

  const { toast } = useToast();

  useEffect(() => {
    setCurrent(`${spc!.name}-arc`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stateStorage) return null;

  const handleUnarchive = async (uuid: string) => {
    const newItems = items.filter((item) => item.uuid !== uuid);
    setItems(newItems);
    try {
      const { data } = await axios.patch(
        USER_WORKSPACE + `/${slug}/spaces/${spc!.name}/unarchive/${uuid}`,
        null,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const res: SingleItem = data;
      toast({
        title: "Item unarchived successfully!",
      });
      const myItems = await getMyItems(token, slug);
      UpdateItemsState(
        res.response,
        spcIndex,
        myItems,
        stateStorage,
        setStateStorage,
        "unarchive"
      );
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.response?.data);
      toast({
        variant: "destructive",
        title: "Could not unarchive item",
      });
    }
  };

  return (
    <section className="min-h-screen overflow-y-auto py-8 px-20 flex-grow right-0 bg-dashboard">
      <div className="pr-12">
        <h2 className="text-xl font-medium text-focus-text-hover flex items-center">
          {" "}
          <Archive size={20} className="mr-2" /> Archive
        </h2>

        <h4 className="text-focus-text text-sm mt-4">
          All Your archived items and cycles will appear here
        </h4>

        <div className="flex justify-between mt-10">
          <div className="min-w-[30rem]">
            <h5 className="text-focus-text-hover flex items-center font-semibold mb-4">
              <ListTodo className="text-less-highlight-chip mr-2" size={16} />
              Items
            </h5>

            {items.length !== 0 ? (
              <div className="flex flex-col gap-y-4 max-w-[30rem]">
                {items.map((item) => (
                  <ArchivedItem
                    key={item.uuid}
                    item={item}
                    space={spc!}
                    handleUnarchive={handleUnarchive}
                  />
                ))}
              </div>
            ) : (
              <h4 className="text-focus-text text-sm mt-8">
                No items found in your archive !
              </h4>
            )}
          </div>
          <div className="w-[1px] bg-divider min-h-80" />

          <div className="min-w-80">
            <h5 className="text-focus-text-hover flex items-center font-semibold mb-4">
              <Zap className="text-less-highlight-chip mr-2" size={16} />
              Cycles
            </h5>

            {past.length !== 0 ? (
              <div className="flex flex-col gap-y-4 text-focus-text">
                {past.map((x) => (
                  <CompletedCycle
                    key={x._id}
                    cycle={x}
                    space={spc!.name}
                    spaceIndex={spcIndex}
                  />
                ))}
              </div>
            ) : (
              <p className="text-focus-text text-sm mt-8">
                No completed cycles
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Archives;
