"use client";

import ActiveCycle from "@/components/smalls/cycle/ActiveCycle";
import CompletedCycle from "@/components/smalls/cycle/CompletedCycle";
import UpcomingCycle from "@/components/smalls/cycle/UpcomingCycle";
import { Cycle } from "@/lib/types/Cycle";
import { dataStore, userStore } from "@/utils/store/zustand";
import {
  AlignStartVertical,
  CheckCircle2,
  Circle,
  Divide,
  SendHorizontal,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const CycleClient = (props: { token: string; slug: string; space: string }) => {
  // Global states
  const setCurrent = userStore((state) => state.setCurrent);
  const stateStorage = dataStore((state) => state.stateStorage);

  const spaceIndex = useMemo<number>(() => {
    if (!stateStorage) return 0;
    const spaceIndex = stateStorage.spaces.findIndex(
      (space) => space.name === props.space
    );
    return spaceIndex;
  }, [stateStorage, props.space]);

  const current = useMemo<Cycle | undefined>(() => {
    if (!stateStorage) return;
    return stateStorage.spaces[spaceIndex].cycles.current;
  }, [stateStorage, spaceIndex]);

  const upcoming = useMemo<Cycle[]>(() => {
    if (!stateStorage) return [];
    return stateStorage.spaces[spaceIndex].cycles.upcoming;
  }, [stateStorage, spaceIndex]);

  const past = useMemo<Cycle[]>(() => {
    if (!stateStorage) return [];
    return stateStorage.spaces[spaceIndex].cycles.completed;
  }, [stateStorage, spaceIndex]);

  // Local state
  const [open, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    setCurrent(`${props.space}-cycle`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const arr = [1];
  const arr1 = [1, 2];

  return (
    <section className="min-h-screen overflow-auto flex-grow right-0 bg-dashboard pt-8 pl-20">
      <div className="">
        <h2 className="text-xl flex items-center font-medium text-focus-text-hover">
          <Zap className="mr-2" size={20} />
          Active
        </h2>
        <h4 className="text-focus-text text-sm mt-2 flex items-center">
          To track progress and productivity of current work items, switch modes
          to change space.
        </h4>
      </div>

      <div className="flex flex-grow gap-x-10 text-sm mt-12">
        <div className="flex flex-grow justify-between max-w-[40rem] pr-8">
          <div>
            <div className="flex items-center justify-between w-64">
              <h4 className="flex items-center gap-x-2 text-focus-text-hover font-semibold">
                <Circle className="text-less-highlight" size={16} />
                Upcoming
              </h4>
            </div>

            {upcoming.length !== 0 ? (
              <div className="mt-8 flex flex-col gap-y-4">
                {upcoming.map((x) => (
                  <UpcomingCycle
                    cycle={x}
                    token={props.token}
                    space={props.space}
                    spaceIndex={spaceIndex}
                    key={x._id}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-8 text-focus-text text-sm">
                No upcoming cycles
              </div>
            )}
          </div>
          <div className="">
            <div className="flex items-center justify-between w-[17rem]">
              <h4 className="flex items-center gap-x-2 text-focus-text-hover font-semibold">
                <Zap className="text-highlight" size={16} />
                This Week
              </h4>
            </div>
            <div className="mt-8 flex flex-col gap-y-6">
              {current ? (
                <ActiveCycle
                  cycle={current}
                  space={props.space}
                  spaceIndex={spaceIndex}
                />
              ) : (
                <p className="text-focus-text text-sm">
                  You don&apos;t have any active cycle
                </p>
              )}
            </div>
          </div>
        </div>
        {/* <div className="w-[1px] bg-divider min-h-60" /> */}

        {/* <div className="">
          <h4 className="text-focus-text-hover flex items-center font-semibold">
            <CheckCircle2 className="text-green-500 mr-2" size={16} />
            Completed
          </h4>

          {past.length !== 0 ? (
            <div className="mt-8 flex flex-col gap-2 text-focus-text">
              {past.map((x) => (
                <CompletedCycle
                  key={x._id}
                  cycle={x}
                  space={props.space}
                  spaceIndex={spaceIndex}
                />
              ))}
            </div>
          ) : (
            <p className="text-focus-text text-sm mt-8">No completed cycles</p>
          )}
        </div> */}

        <div className="flex-grow bg-dashboard h-screen min-w-[20rem] absolute top-0 right-0 rounded-l-[10px] border-l border-item-border p-4">
          <div className="relative flex grow flex-1 min-h-[calc(100vh-32px)] flex-col justify-between gap-y-2">
            <div className="flex items-center gap-x-4 text-focus-text-hover font-normal">
              <div className="flex items-center gap-x-2">
                <AlignStartVertical size={18} />
                Activities in This Week
              </div>
              {/* <div>Week 1</div> */}
            </div>

            <div className="flex flex-col gap-y-6 justify-center items-center text-focus-text">
              <div className="text-xs flex flex-col justify-center items-center">
                <div>
                  <span className="font-semibold">@sajdakabir</span> moved item
                  activity to in progess
                </div>
                <div className="text-nonfocus-text">10:21 am</div>
              </div>
              <div className="text-xs px-4 items-center justify-center flex flex-col">
                <div>
                  <span className="font-semibold">@sreejan</span> commented on
                  item-135
                </div>
                <div>
                  &quot;can we test it now?&quot;{" "}
                  <span className="text-nonfocus-text">18:12 pm</span>
                </div>
              </div>
              <div className="text-xs flex flex-col justify-center items-center">
                <div>
                  <span className="font-semibold">@oliursahin</span> commented
                  &quot;Let&apos;s roll&quot;
                </div>
                <div className="text-nonfocus-text">18: 32 pm</div>
              </div>
              <input
                className="bg-item"
                type="text"
                placeholder="Leave a comment"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CycleClient;
