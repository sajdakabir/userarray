"use client";

import UserAvatar from "@/components/smalls/avatar/UserAvatar";
import { TextEditor } from "@/components/smalls/editor/RichEditor";
import { Roadmap } from "@/lib/types/Roadmap";
import { dataStore, userStore } from "@/utils/store/zustand";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useMemo } from "react";

type RoadmapProps = {
  slug: string;
  space: string;
  token: string;
  id: number;
};

const RoadmapClient: FC<RoadmapProps> = ({ slug, space, token, id }) => {
  const stateStorage = dataStore((state) => state.stateStorage);
  const setCurrent = userStore((state) => state.setCurrent);

  const spcIndex = useMemo(() => {
    if (!stateStorage) return -1;
    return stateStorage.spaces.findIndex((spce) => spce.name === space);
  }, [space, stateStorage]);

  const spc = stateStorage!.spaces[spcIndex];

  const thisRoadmap = spc.roadmaps[id - 1];

  const rdMembers = useMemo(() => {
    return stateStorage!.members.filter((d) =>
      thisRoadmap.assignees.includes(d.member._id)
    );
  }, [thisRoadmap, stateStorage]);

  const rdLabels = useMemo(() => {
    if (!stateStorage) return [];
    return stateStorage.spaces[spcIndex].labels.filter((l) =>
      thisRoadmap.labels.includes(l._id)
    );
  }, [thisRoadmap, stateStorage, spcIndex]);

  useEffect(() => {
    setCurrent("");
  }, [setCurrent]);

  //   const members = useMemo(() => {}, [stateStorage]);

  return (
    <section className="min-h-screen flex flex-col overflow-y-auto flex-grow bg-dashboard">
      <div className="min-h-full flex flex-grow items-stretch pt-8 pb-4">
        <div className="flex-grow flex flex-col overflow-y-auto">
          <div className="">
            <div className="flex items-center">
              <button
                className="pointer-default ml-6 mr-5 p-[6px] rounded-md hover:bg-sidebar-button-active"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={22} className="text-focus-text-hover" />
              </button>
              <div className="text-focus-text text-sm capitalize">
                <Link className="hover:text-focus-text-hover" href={``}>
                  {slug}
                </Link>{" "}
                &gt;{" "}
                <Link className="hover:text-focus-text-hover" href={``}>
                  {space}
                </Link>{" "}
                &gt;{" "}
                <span className="hover:text-focus-text-hover uppercase">
                  {spc.identifier} - {id}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-row overflow-y-auto">
            <div className="flex flex-col overflow-y-auto flex-grow max-w-[50rem]">
              <div className="mt-5 text-focus-text flex flex-col gap-y-2 text-sm ml-20">
                <div className="flex flex-row items-center gap-x-4">
                  <h2 className="text-3xl font-medium text-focus-text-hover border-none bg-transparent px-0">
                    Backend
                  </h2>
                  <p>3 / 9 completed</p>

                  <div className="flex items-center">
                    {rdMembers.map((member, index) => (
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
                </div>
                <div className=" text-cyan-400 bg-cyan-800/20 w-fit rounded-md py-[2px] px-[6px]">
                  status: current
                </div>
                {thisRoadmap.targetDate && (
                  <div className="flex flex-row items-center gap-x-2">
                    <span className="text-focus-text-hover">Target: </span>
                    {format(new Date(thisRoadmap.targetDate), "MMM do yyyy")}
                  </div>
                )}
              </div>

              {/* Markdown Section */}
              <div className="rounded-xl ml-20 mt-10">
                <TextEditor
                  editable={true}
                  className="[&>.ProseMirror.tiptap]:min-h-56"
                  content={"<p></p>"}
                  setContent={(text: string) => console.log(text)}
                />
              </div>

              {/* Item Section */}
              <div className="ml-20 gap-y-10 my-10 bg-red-600">
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Ratione cupiditate quos, modi magnam architecto quam fugiat
                excepturi ex quaerat debitis doloremque corrupti a cumque odio,
                aut omnis accusantium, minima repellat vitae maiores culpa
                voluptates. Optio suscipit nisi dolorem repudiandae tempore
                earum itaque et dolores voluptate mollitia consequuntur harum
                illum voluptatibus ex delectus voluptates voluptatem sint,
                architecto accusantium? Consectetur, unde ab ipsum ea cupiditate
                accusantium ducimus earum quaerat dolorum enim harum suscipit
                amet magni est labore officiis quia voluptate? Cumque tenetur
                labore aliquid laboriosam. Numquam voluptatibus culpa eius
                fugiat, sint eveniet sunt error fugit rerum praesentium alias
                totam nostrum quae repellendus, saepe eos, id incidunt est. A
                dignissimos modi provident. Velit, placeat delectus et fugit,
                quibusdam cupiditate quos tenetur molestiae inventore ab est
                libero distinctio aliquam deleniti, officia iusto aspernatur
                quo. Totam itaque vitae facilis ipsa vel laboriosam expedita
                veritatis molestiae laborum placeat provident distinctio minus
                porro natus s odit cupiditate laudantium saepe nostrum maiores
                magni, modi blanditiis aliquam repudiandae distinctio, unde
                doloremque? Eaque aperiam dolor atque accusamus debitis.
              </div>
            </div>

            <div className="ml-4 border-l border-divider max-h-[calc(100vh-100px)] overflow-y-auto">
              {/* <div className="w-[1px] bg-divider mx-8" /> */}

              <div className="text-focus-text flex-grow ml-6">Activity</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoadmapClient;
