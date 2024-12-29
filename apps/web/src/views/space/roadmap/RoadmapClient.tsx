"use client";

import RoadmapCard from "@/components/smalls/roadmap/RoadmapCard";
import { dataStore, userStore } from "@/utils/store/zustand";
import { Plus, Route } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { FC, useEffect, useMemo, useState } from "react";
import CreateRoadmap from "@/components/smalls/roadmap/CreateRoadmap";

type RoadmapClientProps = { token: string; slug: string; space: string };

const RoadmapClient: FC<RoadmapClientProps> = ({ token, slug, space }) => {
  const stateStorage = dataStore((state) => state.stateStorage);
  const setCurrent = userStore((state) => state.setCurrent);

  const [draftOpen, setDraftOpen] = useState<boolean>(false);
  const [nextOpen, setNextOpen] = useState<boolean>(false);
  const [nowOpen, setNowOpen] = useState<boolean>(false);

  const spcIndex = useMemo(() => {
    if (!stateStorage) return -1;
    return stateStorage.spaces.findIndex((spce) => spce.name === space);
  }, [space, stateStorage]);

  const spc = stateStorage!.spaces[spcIndex];

  const [drafts, next, now] = useMemo(() => {
    const roads = spc.roadmaps;
    const drafts = roads.filter((item) => item.horizon === "draft");
    const next = roads.filter((item) => item.horizon === "next");
    const now = roads.filter((item) => item.horizon === "now");

    return [drafts, next, now];
  }, [spc]);

  useEffect(() => {
    setCurrent(`${space}-roadmap`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="min-h-screen overflow-y-auto flex-grow right-0 bg-dashboard py-8 px-20 text-focus-text">
      <div className="">
        <h2 className="text-xl flex items-center font-medium text-focus-text-hover">
          <Route className="mr-2" size={20} />
          Roadmap
        </h2>
        <h4 className="text-focus-text text-sm mt-2 flex items-center">
          Roadmap is the place where you breakdown your large project into epics
        </h4>
      </div>

      <div className="flex flex-grow mt-12">
        <div className="text-sm flex justify-start gap-x-10 pr-8">
          <div className="min-w-64">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-1 text-focus-text-hover font-semibold">
                {/* <Inbox size={16} className="mr-1 text-highlight" /> */}
                Drafts
                <span className="text-nonfocus-text font-normal">
                  {drafts.length} roadmaps
                </span>
              </h4>
              <Dialog open={draftOpen} onOpenChange={setDraftOpen}>
                <DialogTrigger
                  className="outline-none focus:outline-none"
                  asChild={true}
                >
                  <button className="text-focus-text-hover">
                    <Plus size={16} />
                  </button>
                </DialogTrigger>
                <CreateRoadmap
                  token={token}
                  slug={slug}
                  spaceIndex={spcIndex}
                  horizon="draft"
                  setIsOpen={setDraftOpen}
                />
              </Dialog>
            </div>

            <div className="flex flex-col gap-y-2 my-8">
              {drafts.length ? (
                drafts.map((rd) => (
                  <RoadmapCard
                    key={rd._id}
                    pop={rd}
                    space={space}
                    done={2}
                    total={6}
                  />
                ))
              ) : (
                <p>No draft roadmaps found</p>
              )}
            </div>
          </div>

          <div className="min-w-64">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-1 text-focus-text-hover font-semibold">
                {/* <Inbox size={16} className="mr-1 text-highlight" /> */}
                Next
                <span className="text-nonfocus-text font-normal">
                  {next.length} roadmaps
                </span>
              </h4>
              <Dialog open={nextOpen} onOpenChange={setNextOpen}>
                <DialogTrigger
                  className="outline-none focus:outline-none"
                  asChild={true}
                >
                  <button className="text-focus-text-hover">
                    <Plus size={16} />
                  </button>
                </DialogTrigger>
                <CreateRoadmap
                  token={token}
                  slug={slug}
                  spaceIndex={spcIndex}
                  horizon="next"
                  setIsOpen={setNextOpen}
                />
              </Dialog>
            </div>

            <div className="flex flex-col gap-y-2 my-8">
              {next.length ? (
                next.map((rd) => (
                  <RoadmapCard
                    key={rd._id}
                    pop={rd}
                    space={space}
                    done={2}
                    total={6}
                  />
                ))
              ) : (
                <p>No upcoming roadmaps found</p>
              )}
            </div>
          </div>
          <div className="min-w-64">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-1 text-focus-text-hover font-semibold">
                {/* <Inbox size={16} className="mr-1 text-highlight" /> */}
                Now
                <span className="text-nonfocus-text font-normal">
                  {now.length} roadmaps
                </span>
              </h4>
              <Dialog open={nowOpen} onOpenChange={setNowOpen}>
                <DialogTrigger
                  className="outline-none focus:outline-none"
                  asChild={true}
                >
                  <button className="text-focus-text-hover">
                    <Plus size={16} />
                  </button>
                </DialogTrigger>
                <CreateRoadmap
                  token={token}
                  slug={slug}
                  spaceIndex={spcIndex}
                  horizon="now"
                  setIsOpen={setNowOpen}
                />
              </Dialog>
            </div>

            <div className="flex flex-col gap-y-2 my-8">
              {now.length ? (
                now.map((rd) => (
                  <RoadmapCard
                    key={rd._id}
                    pop={rd}
                    space={space}
                    done={2}
                    total={6}
                  />
                ))
              ) : (
                <p>No current roadmaps found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapClient;
