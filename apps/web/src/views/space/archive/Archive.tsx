"use client";

import { Item, SingleItem } from "@/lib/types/Items";
import { dataStore, userStore } from "@/utils/store/zustand";
import { Archive } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { useToast } from "@/components/ui/use-toast";
import axios, { AxiosError } from "axios";
import ArchivedItem from "@/components/smalls/items/ArchivedItem";
import { getMyItems } from "@/server/fetchers/items/get-workitems";
import { UpdateItemsState } from "@/utils/state-manager/item-updater";

const ArchiveClient = (props: {
  token: string;
  slug: string;
  space: string;
}) => {
  // Global states
  const setCurrent = userStore((state) => state.setCurrent);
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);

  const [spcIndex, spc] = useMemo(() => {
    if (!stateStorage) return [0, null];
    const index = stateStorage.spaces.findIndex(
      (state) => state.name === props.space
    );
    return [index, stateStorage.spaces[index]];
  }, [stateStorage, props.space]);

  // Local state
  const [items, setItems] = useState<Item[]>(spc!.archived);

  const { toast } = useToast();

  useEffect(() => {
    setCurrent(`${props.space}-archive`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stateStorage) return null;

  const handleUnarchive = async (uuid: string) => {
    const newItems = items.filter((item) => item.uuid !== uuid);
    setItems(newItems);
    try {
      const { data } = await axios.patch(
        USER_WORKSPACE +
          `/${props.slug}/spaces/${props.space}/unarchive/${uuid}`,
        null,
        {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        }
      );
      const res: SingleItem = data;
      toast({
        title: "Item unarchived successfully!",
      });
      const myItems = await getMyItems(props.token, props.slug);
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
      <div className="w-5/6">
        <h2 className="text-xl font-medium text-focus-text-hover flex items-center">
          {" "}
          <Archive size={20} className="mr-2" /> Archive
        </h2>

        {items.length !== 0 ? (
          <>
            <h4 className="text-focus-text text-sm mt-4">
              All Your archived items will appear here
            </h4>

            <div className="flex flex-col gap-4 mt-16 max-w-[30rem]">
              {items.map((item) => (
                <ArchivedItem
                  key={item.uuid}
                  item={item}
                  space={spc!}
                  handleUnarchive={handleUnarchive}
                />
              ))}
            </div>
          </>
        ) : (
          <h4 className="text-focus-text text-sm mt-10">
            No items found in your archive !
          </h4>
        )}
      </div>
    </section>
  );
};

export default ArchiveClient;
