"use client";

import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import UserAvatar from "@/components/smalls/avatar/UserAvatar";
import { toast } from "@/components/ui/use-toast";
import { Cycle } from "@/lib/types/Cycle";
import { Item } from "@/lib/types/Items";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import { dataStore, userStore } from "@/utils/store/zustand";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import Link from "next/link";
import { FC, useEffect, useMemo, useState } from "react";
import ActiveCycle from "./ActiveCycle";
import CompletedCycle from "./CompletedCycle";
import { findCycle } from "@/utils/helpers";
import { ArrowLeft, Ellipsis } from "lucide-react";
import { isBefore } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { NextButton } from "@/components/ui/custom-buttons";

type ActiveClientProps = {
  token: string;
  space: string;
  id: string;
};

const ActiveClient: FC<ActiveClientProps> = ({ token, space, id }) => {
  const setCurrent = userStore((state) => state.setCurrent);
  const slug = userStore((state) => state.slug);
  const stateStorage = dataStore((state) => state.stateStorage);

  // calculations
  const members = useMemo<WorkspaceMember[]>(() => {
    if (!stateStorage) return [];
    return stateStorage.members;
  }, [stateStorage]);

  const spaceIndex: number = useMemo(() => {
    if (!stateStorage) return -1;
    return stateStorage.spaces.findIndex((spac) => spac.name === space);
  }, [stateStorage, space]);

  const thisCycle = useMemo<Cycle | undefined>(() => {
    if (!stateStorage) return undefined;
    return findCycle(stateStorage.spaces[spaceIndex].cycles, id);
  }, [id, spaceIndex, stateStorage]);

  const isCompleted = useMemo(() => {
    if (!thisCycle?.endDate) {
      return false;
    }
    const today = new Date();
    const endDate = new Date(thisCycle.endDate);
    endDate.setDate(endDate.getDate() + 1);
    return isBefore(endDate, today);
  }, [thisCycle]);

  const cycleItems = useMemo<Item[]>(() => {
    if (!stateStorage) return [];
    const all_Items = stateStorage.spaces[spaceIndex].items;
    let items: Item[] = [];
    all_Items.forEach((item) => {
      item.cycles.forEach((c) => {
        if (c === thisCycle!._id) {
          items.push(item);
        }
      });
    });
    return items;
  }, [thisCycle, spaceIndex, stateStorage]);

  const [doneItems, todoItems, inboxItems, inProgressItems] = useMemo(() => {
    const doneItems = cycleItems.filter((item) => item.status === "done");
    const todoItems = cycleItems.filter((item) => item.status === "todo");
    const inboxItems = cycleItems.filter((item) => item.status === "inbox");
    const inProgressItems = cycleItems.filter(
      (item) => item.status === "in progress"
    );
    return [doneItems, todoItems, inboxItems, inProgressItems];
  }, [cycleItems]);

  const progressPercentage = useMemo(() => {
    if (cycleItems.length === 0) return 0;
    const percentage = (doneItems.length * 100) / cycleItems.length;
    const formattedPercentage =
      percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(1);

    return formattedPercentage;
  }, [doneItems, cycleItems]);

  const [cycleName, setCycleName] = useState<string>(thisCycle!.name);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setCurrent(`${thisCycle!.name}-${thisCycle!.space}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stateStorage || !thisCycle) return null;

  const updateCycle = async (body: any) => {
    setLoading(true);
    try {
      await axios.patch(
        USER_WORKSPACE + `/${slug}/spaces/${space}/cycles/${thisCycle?.uuid}`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // update state storage locally
      let temp = stateStorage;
      let c = temp.spaces[spaceIndex].cycles;
      // const q = c.findIndex((cycl) => cycl._id === thisCycle?._id);
      // c[q].name = body.name;
      // temp.spaces[spaceIndex].cycles = c;
      // setStateStorage(temp);
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response?.data);
      toast({
        variant: "destructive",
        title: "Something Went Wrong!",
      });
    }
    setLoading(false);
  };

  return (
    <section className="min-h-screen flex flex-col flex-grow overflow-y-auto bg-dashboard pt-8">
      <div
        className={`text-focus-text flex items-center gap-x-1 text-sm ${
          isCompleted ? "px-6" : "px-10"
        }`}
      >
        {isCompleted && (
          <button
            className="pointer-default mr-5 p-[6px] rounded-md hover:bg-sidebar-button-active"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={22} className="text-focus-text-hover" />
          </button>
        )}
        <Link className="hover:text-focus-text-hover" href={`#`}>
          {slug}
        </Link>{" "}
        &gt;{" "}
        <Link className="hover:text-focus-text-hover" href={`#`}>
          Active
        </Link>{" "}
        &gt;{" "}
        <span className="hover:text-focus-text-hover">
          <span className="uppercase">
            {stateStorage.spaces[spaceIndex].identifier}
          </span>{" "}
          - {thisCycle!.sequenceId}
        </span>
        <Popover>
          <PopoverTrigger className="ml-8 text-focus-text-hover p-1 opacity-50 hover:opacity-100 border border-dashboard hover:border-divider  rounded-md duration-200">
            <Ellipsis size={16} />
          </PopoverTrigger>
          <PopoverContent className="bg-sidebar flex justify-between rounded-[10px] border-divider shadow-md shadow-black/40 p-2">
            <input
              type="text"
              name="cycle_name"
              value={cycleName}
              className="text-sm py-1 w-fit"
              onChange={(e) => {
                setCycleName(e.target.value);
              }}
            />
            <NextButton
              text="Save"
              handleClick={() => updateCycle({ name: cycleName })}
              loading={loading}
              className="text-sm px-2 w-fit font-medium py-[2px] rounded-md bg-focus-text-hover"
              disabled={loading}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div
        className={`mt-5 text-focus-text flex flex-col gap-y-2 text-sm ${
          isCompleted ? "px-20" : "px-10"
        }`}
      >
        <div className="flex flex-row items-center gap-x-4">
          {/* <input
            type="text"
            name="cycle_name"
            value={cycleName}
            // update cycle name on change
            onChange={(e) => {
              setCycleName(e.target.value);
            }}
            // update cycle name on blur
            onBlur={() => {
              updateCycle({ name: cycleName });
            }}
            className="text-2xl max-w-fit font-medium text-focus-text-hover border-none bg-transparent px-0"
          /> */}
          <h2 className="text-2xl font-medium text-focus-text-hover border-none bg-transparent px-0">
            {cycleName}
          </h2>
          <p>
            {doneItems.length} / {cycleItems.length} completed
          </p>

          <div className="flex items-center">
            {members.map((member, index) => (
              <UserAvatar
                key={index}
                index={index}
                name={member.member.fullName}
                image={member.member.avatar}
                size={7}
                className="border-dashboard"
              />
            ))}
          </div>
          <div className="text-lg">{progressPercentage} %</div>
          <div className="flex flex-row items-center gap-x-2">
            {/* <span className="text-xs text-amber-400 py-[2px] px-[6px] bg-amber-800/20 rounded-md w-fit">
              mode: blitz
            </span>{" "} */}
            {format(new Date(thisCycle!.startDate), "MMM do")} -{" "}
            {format(new Date(thisCycle!.endDate), "MMM do")}
          </div>
        </div>
      </div>

      {isCompleted ? (
        <CompletedCycle
          doneItems={doneItems}
          space={stateStorage.spaces[spaceIndex]}
        />
      ) : (
        <ActiveCycle
          token={token}
          space={space}
          thisCycle={thisCycle!}
          spaceIndex={spaceIndex}
          inboxItems={inboxItems}
          inProgressItems={inProgressItems}
          todoItems={todoItems}
          doneItems={doneItems}
        />
      )}
    </section>
  );
};

export default ActiveClient;
