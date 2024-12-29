"use client";

import { Item, Status, efforts, statuses } from "@/lib/types/Items";
import { userStore, dataStore } from "@/utils/store/zustand";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Label } from "@/lib/types/Labels";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import AssigneeSelector from "@/components/smalls/items/selector/AssigneeSelector";
import StatusSelector from "@/components/smalls/items/selector/StatusSelector";
import { DatePicker } from "@/components/ui/date-picker";
import LabelSelector from "@/components/smalls/items/selector/LabelSelector";
import { History, ArrowLeft } from "lucide-react";
import CycleSelector from "@/components/smalls/items/selector/CycleSelector";
import {
  UpdateItem,
  UpdateItemsState,
} from "@/utils/state-manager/item-updater";
import { Cycle } from "@/lib/types/Cycle";
import { TextEditor } from "@/components/smalls/editor/RichEditor";
import { findCycle, formattedDate, truncateString } from "@/utils/helpers";
import { patchItem } from "@/server/patchers/item-patcher";
import { getItemHistory } from "@/server/fetchers/items/get-activities";
import { useQuery } from "@tanstack/react-query";
import ItemActivityLog from "./ItemActivityLog";

// type ItemActivity = {
//   "_id": string
//   "verb": string
//   "comment": string
//   "attachments": string[]
//   "oldIdentifier": null
//   "newIdentifier": null
//   "oldValue": string
//   "newValue": string
//   "space": string
//   "workspace": string
//   "item": string
//   "actor": string
//   "uuid": string
//   "createdAt": string
//   "updatedAt": string
//   "__v": number
// }

type ItemActivity = {
  _id: string;
  verb: string;
  comment: string;
  attachments: string[];
  oldIdentifier: null;
  newIdentifier: null;
  oldValue: string | null;
  newValue: string | null;
  space: string;
  workspace: string;
  item: string;
  actor: {
    userName: string;
    fullName: string;
  };
  uuid: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};


const ItemClient = (props: { token: string; space: string; id: string }) => {
  // Global states
  const setCurrent = userStore((state) => state.setCurrent);
  const slug = userStore((state) => state.slug);
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);
  const dayBoards = dataStore((state) => state.dayBoards);

  const spcIndex = useMemo(
    () => stateStorage!.spaces.findIndex((spce) => spce.name === props.space),
    [props.space, stateStorage]
  );
  const spc = stateStorage!.spaces[spcIndex];
  const usableCycles = useMemo<Cycle[]>(() => {
    return [spc!.cycles.current, ...spc!.cycles.upcoming];
  }, [spc]);
  const thisItem = useMemo(
    () => spc!.items.find((itm) => itm._id === props.id),
    [props.id, spc]
  );
  const itemMembers = useMemo(() => {
    return stateStorage!.members.filter((d) =>
      thisItem!.assignees.includes(d.member._id)
    );
  }, [thisItem, stateStorage]);

  const itemLabels = useMemo(() => {
    if (!stateStorage || !thisItem) return [];
    return stateStorage.spaces[spcIndex].labels.filter((l) =>
      thisItem.labels.includes(l._id)
    );
  }, [thisItem, stateStorage, spcIndex]);

  const thisCycle = useMemo<Cycle | undefined>(() => {
    if (!stateStorage || !thisItem) return undefined;
    if (thisItem.cycles.length === 0) return undefined;
    return findCycle(stateStorage.spaces[spcIndex].cycles, thisItem.cycles[0]);
  }, [thisItem, spcIndex, stateStorage]);

  const [statusIndex, effortIndex] = useMemo(() => {
    const statusIndex = statuses.findIndex(
      (status) => status.value === thisItem!.status
    );
    const effortIndex = efforts.findIndex(
      (prio) => prio.value === thisItem!.effort
    );
    return [statusIndex, effortIndex];
  }, [thisItem]);

  // Local States
  const [item, setItem] = useState<Item>(thisItem!);
  const [selLabels, setLabels] = useState<Label[]>(itemLabels);
  const [cycles, setCycles] = useState<Cycle[]>(thisCycle ? [thisCycle] : []);
  const [dueDate, setDueDate] = useState(
    thisItem!.dueDate ? new Date(thisItem!.dueDate) : undefined
  );

  const [itemStatus, setStatus] = useState<Status>(statuses[statusIndex]);
  const [itemEffort, setEffort] = useState<Status>(efforts[effortIndex]);
  const [members, setMembers] = useState<WorkspaceMember[]>(itemMembers);

  const {data: itemActivity} = useQuery({
    queryKey: ['hello'],
    queryFn: async()=> await getItemHistory(props.token, slug ,props.space ,props.id) as unknown as ItemActivity[],
    refetchInterval: 1000
  })

  console.log(itemActivity);

  useEffect(() => {
    setCurrent("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!stateStorage) return null;

  const handleTitleBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "") return;
    const newItem = await patchItem(
      {
        name: e.target.value,
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      setItem(newItem);
      UpdateItemsState(
        newItem,
        spcIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "update"
      );
    }
  };

  const handleDescription = async (text: string) => {
    const newItem = await patchItem(
      {
        description: text,
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      setItem(newItem);
      UpdateItemsState(
        newItem,
        spcIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "update"
      );
    }
  };

  const handleDueDateChange = async (date: Date | undefined) => {
    setDueDate(date);
    await UpdateItem(
      {
        dueDate: date ? formattedDate(date) : null,
      },
      spcIndex,
      stateStorage,
      setStateStorage,
      slug,
      item.uuid,
      props.token
    );
  };

  const handleLabelClick = async (newLabels: Label[]) => {
    setLabels(newLabels);
    const newItem = await patchItem(
      {
        labels: newLabels.map((l) => l._id),
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      UpdateItemsState(
        newItem,
        spcIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "update"
      );
    }
  };

  const handleAssigneeClick = async (newAssignees: WorkspaceMember[]) => {
    setMembers(newAssignees);
    await UpdateItem(
      {
        assignees: newAssignees.map((a) => a.member._id),
      },
      spcIndex,
      stateStorage,
      setStateStorage,
      slug,
      item.uuid,
      props.token
    );
  };

  const handleStatusClick = async (newStatus: Status) => {
    setStatus(newStatus);
    const newItem = await patchItem(
      {
        status: newStatus.value,
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      UpdateItemsState(
        newItem,
        spcIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "update"
      );
    }
  };

  const handleEffortClick = async (newEffort: Status) => {
    setEffort(newEffort);
    const newItem = await patchItem(
      {
        effort: newEffort.value,
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      UpdateItemsState(
        newItem,
        spcIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "update"
      );
    }
  };

  const handleCycleClick = async (newCycle: Cycle[]) => {
    if (
      newCycle.length === 0 &&
      (itemStatus.value === "in progress" || itemStatus.value === "done")
    ) {
      // If user selects no cycle, set status to "todo"
      await handleStatusClick(statuses[1]);
    }
    const newItem = await patchItem(
      {
        cycles: newCycle.map((c) => c._id),
      },
      slug,
      props.space,
      item.uuid,
      props.token
    );
    if (newItem) {
      setCycles(newCycle);
      UpdateItemsState(
        newItem,
        spcIndex,
        {
          inbox: stateStorage.inbox,
          today: dayBoards[0].today,
        },
        stateStorage,
        setStateStorage,
        "update"
      );
    }
  };


  // here

  // const ItemActivityLog = ({ itemActivity, showIssue }) => {
  //   // If itemActivity is falsy, show a loading message.
  //   if (!itemActivity) {
  //     return <p className="text-white">Loading...</p>;
  //   }
  
  //   // If itemActivity is truthy, map over the array and render each activity.
  //   return itemActivity.map((item) => {
  //     // Get the activity type details based on the item's verb.
  //     const activityType = activityDetails[item.verb]; // Adjust this based on how you categorize activities
  
  //     // Return the JSX for each item in the itemActivity array.
  //     return (
  //       <div key={item._id} className="w-full text-gray-300 flex flex-col py-2 justify-center gap-2 border-b border-gray-300">
  //         <div className="flex items-center justify-between text-sm text-gray-300">
  //           <div>
  //             <span className="font-semibold">{item.actor.userName || item.actor.fullName}</span>{" "}
  //             {activityType ? activityType.message(item, showIssue) : `${item.verb} the item`}
  //           </div>
  //           <div className="text-xs text-gray-300">{formattedDate(item.createdAt)}</div>
  //         </div>
  //         <div className="flex items-center justify-between text-sm">
  //           <div className="flex flex-col">
  //             {item.oldValue && (
  //               <>
  //                 <span className="font-semibold">Old Value</span>
  //                 <span dangerouslySetInnerHTML={{ __html: item.oldValue }} />
  //               </>
  //             )}
  //           </div>
  //           <div className="flex flex-col">
  //             {item.newValue && (
  //               <>
  //                 <span className="font-semibold">New Value</span>
  //                 <span dangerouslySetInnerHTML={{ __html: item.newValue }} />
  //               </>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     );
  //   });
  // };
  

  // ending here


  return (
    <div className="flex flex-grow">
      <div className="h-screen w-[1px] bg-divider"></div>
      <section className="min-h-screen overflow-y-auto flex-grow bg-sidebar">
        <div className="overflow-y-auto min-h-full flex flex-grow items-stretch">
          <div className="flex-grow min-w-[47rem] min-h-full flex flex-col justify-between mt-8">
            <div className="">
              <div className="flex items-center">
                <button
                  className="pointer-default ml-6 mr-5 p-[6px] rounded-md hover:bg-sidebar-button-active"
                  onClick={() => window.history.back()}
                >
                  <ArrowLeft size={22} className="text-focus-text-hover" />
                </button>
                <div className="text-focus-text text-sm capitalize">
                  <Link
                    className="hover:text-focus-text-hover"
                    href={`/${slug}/${props.space}/active`}
                  >
                    {slug}
                  </Link>{" "}
                  &gt;{" "}
                  <Link
                    className="hover:text-focus-text-hover"
                    href={`/${slug}/${props.space}/plan`}
                  >
                    {props.space}
                  </Link>{" "}
                  &gt;{" "}
                  <span className="hover:text-focus-text-hover">
                    {spc!.identifier} - {item?.sequenceId}
                  </span>
                </div>
              </div>

              <div className="mt-5 ml-20">
                <input
                  type="text"
                  value={item?.name}
                  onChange={(e) => {
                    const _item = { ...item!, name: e.target.value };
                    setItem(_item);
                  }}
                  onBlur={handleTitleBlur}
                  className="text-3xl font-medium text-focus-text-hover border-none bg-transparent px-0"
                />

                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      {/* assignees Selector */}
                      <AssigneeSelector
                        selectedMem={members}
                        setSelectedMem={handleAssigneeClick}
                      />

                      {/* Priority Selector */}
                      <StatusSelector
                        status={itemEffort}
                        setStatus={handleEffortClick}
                        statuses={efforts}
                      />

                      {/* Status Selector */}
                      <StatusSelector
                        status={itemStatus}
                        setStatus={handleStatusClick}
                        statuses={
                          cycles.length === 1 ? statuses : statuses.slice(0, 2)
                        }
                      />

                      <DatePicker
                        text="Due"
                        date={dueDate}
                        setDate={handleDueDateChange}
                      />

                      <CycleSelector
                        cycles={cycles}
                        allCycles={usableCycles}
                        setCycles={handleCycleClick}
                      />
                    </div>

                    <div className="z-20">
                      <LabelSelector
                        space={spc!}
                        selLabels={selLabels}
                        setLabels={handleLabelClick}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl mt-10">
                  <TextEditor
                    editable={true}
                    className="[&>.ProseMirror.tiptap]:min-h-[calc(100vh-300px)]"
                    content={item!.description}
                    setContent={handleDescription}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-grow rounded-l-[10px] border border-item-border p-4 ml-8">
            <div className="flex h-full flex-col justify-between gap-y-2">
              <div className="flex items-center gap-x-4 text-focus-text-hover font-medium">
                <div className="flex items-center gap-x-2 text-sm">
                  <History size={16} />
                  Activities
                </div>
                {/* <div>Week 1</div> */}
              </div>
{/* working code  */}
             {/* <div className="flex flex-col items-center justify-start h-full">

              {itemActivity ? itemActivity.map((item, index)=>{
                return <div className="h-fit w-full flex flex-col py-2 justify-center gap-2 border-y text-white border-gray-400">
                      <div className="flex items-center justify-between text-gray-300 w-full">
                      <h1>{item.verb}</h1>
                      <h1>{item.actor}</h1>
                      </div>
                      <div className="flex items-center justify-between w-full">
                      {item.oldValue}
                      {item.newValue}
                      </div>
                      </div>
              }): <p className="text-white">Loading...</p>}

              </div>  */}

              {/* end of it */}



{/* mess starting */}
{/* <h3 className="font-semibold">Activity Log</h3> */}
          {itemActivity && <ItemActivityLog itemActivity={itemActivity} />}

{/* right one */}
{/* <div className="flex flex-col items-center justify-start h-full overflow-y-auto">
  {itemActivity ? (
    itemActivity.map((item, index) => (
      <div key={item._id} className="w-full text-gray-300 flex flex-col py-2 justify-center gap-2 border-b border-gray-300">

        <div className="flex items-center justify-between text-smtext-gray-300">
          <div>
            <span className="font-semibold">{item.actor.userName || item.actor.fullName}</span> {item.verb} the item
          </div>
          <div className="text-xs text-gray-300">{formattedDate(item.createdAt)}</div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex flex-col">
            <span className="font-semibold"></span>
            <span
                    dangerouslySetInnerHTML={{ __html: item.oldValue }}
                    />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold"></span>
            <span dangerouslySetInnerHTML={{ __html: item.newValue }}/>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p className="text-white">Loading...</p>
  )}
</div> */}

{/* it's ending here */}
                



  {/* end the mess */}

              <div>
                <input
                  className="bg-item text-sm"
                  type="text"
                  placeholder="Leave a comment"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default ItemClient;






