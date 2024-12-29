"use client";

import CycleActivitySection from "@/components/activity/CycleActivitySection";
import ActiveCycle from "@/components/smalls/cycle/ActiveCycle";
import UpcomingCycle from "@/components/smalls/cycle/UpcomingCycle";
import { Cycle } from "@/lib/types/Cycle";
import { dataStore, userStore } from "@/utils/store/zustand";
import { Circle, Zap } from "lucide-react";
import { useEffect, useMemo } from "react";

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

  useEffect(() => {
    setCurrent(`${props.space}-cycle`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="min-h-screen overflow-auto flex-grow right-0 bg-dashboard pl-20">
      <div className="overflow-y-auto min-h-full flex flex-grow items-stretch justify-between">
        <div className="pt-8">
          <div className="">
            <h2 className="text-xl flex items-center font-medium text-focus-text-hover">
              <Zap className="mr-2" size={20} />
              Active
            </h2>
            <h4 className="text-focus-text text-sm mt-2 flex items-center">
              To track progress and productivity of current work items, switch
              modes to change space.
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
          </div>
        </div>
        <CycleActivitySection
          cycle={current}
          cycleId={current!._id}
          space={props.space}
          token={props.token}
        />
      </div>
    </section>
  );
};

export default CycleClient;
