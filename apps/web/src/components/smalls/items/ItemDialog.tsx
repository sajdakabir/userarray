/* eslint-disable react-hooks/exhaustive-deps */

import {
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { NextButton } from "@/components/ui/custom-buttons";
import StatusSelector from "@/components/smalls/items/selector/StatusSelector";
import { GetPriority } from "./GetIcons";
import { Item, Status, efforts, statuses } from "@/lib/types/Items";
import { useEffect, useState } from "react";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { dataStore, userStore } from "@/utils/store/zustand";
import { Maximize2 } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import AssigneeSelector from "./selector/AssigneeSelector";
import { WorkspaceMember } from "@/lib/types/Workspaces";

const ItemDialog = (props: {
  token: string;
  item: Item;
  spaceName: string;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const { toast } = useToast();

  // Global states
  const slug = userStore((state) => state.slug);
  // const buildStateWorkspace = dataStore((state) => state.buildStateWorkspace);
  const workspaces = dataStore((state) => state.workspaces);
  // const members = dataStore((state) => state.workspaceMembers);

  // Local states
  const [updatedItem, setUpdatedItem] = useState<Item>(props.item);
  const [selectedMem, setSelectedMem] = useState<WorkspaceMember[]>([]);
  const [itemName, setItemName] = useState<string>(props.item.name);
  const [itemDec, setItemDec] = useState<string>(props.item.description);
  const [loading, setLoading] = useState<boolean>(false);
  const [changed, setChanged] = useState<boolean>(false);
  const [startdate, setStartDate] = useState<Date>();
  const [enddate, setEndDate] = useState<Date>();

  const sta_index = statuses.findIndex(
    (status) => status.value === props.item.status
  );
  const effortIndex = efforts.findIndex(
    (prio) => prio.value === props.item.effort
  );

  const [selectedStatus, setSelectedStatus] = useState<Status>(
    statuses[sta_index]
  );
  const [selectEffort, setSelectEffort] = useState<Status>(
    efforts[effortIndex]
  );

  // useEffect(() => {
  //   if (props.item.startDate) {
  //     const strDt = new Date(JSON.parse(`"${props.item.startDate}"`));
  //     setStartDate(strDt);
  //   }
  //   if (props.item.endDate) {
  //     const strDt = new Date(JSON.parse(`"${props.item.endDate}"`));
  //     setEndDate(strDt);
  //   }
  // }, []);

  useEffect(() => {
    if (
      props.item.name === itemName &&
      props.item.description === itemDec &&
      selectedStatus === statuses[sta_index] &&
      selectEffort === efforts[effortIndex]
    ) {
      setChanged(false);
    } else {
      setChanged(true);
    }
  }, [itemName, itemDec, selectedStatus, selectEffort]);

  // useEffect(() => {
  //   const assignedIds = props.item.assignees.map((mem) => mem._id);
  //   const assignedMembers = members.filter((m) =>
  //     assignedIds.includes(m.member._id)
  //   );
  //   setSelectedMem(assignedMembers);
  // }, [members]);

  const handleInput = (e: any) => {
    setItemDec(e.target.innerText);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { data } = await axios.patch(
        USER_WORKSPACE +
          `/${slug}/spaces/${props.spaceName}/items/${props.item.uuid}`,
        {
          name: itemName,
          description: itemDec,
          status: selectedStatus.value,
          effort: selectEffort.value,
          startDate: startdate ? JSON.stringify(startdate).slice(1, -1) : null,
          endDate: enddate ? JSON.stringify(enddate).slice(1, -1) : null,
          assignees: selectedMem.map((mem) => mem.member._id),
        },
        {
          headers: {
            Authorization: "Bearer " + props.token,
          },
        }
      );
      toast({
        title: "Item updated successfully!",
      });
      setChanged(false);
      props.setIsOpen(false);
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.message);
      toast({
        variant: "destructive",
        title: "Something Went Wrong!",
      });
    }
    // BUG: Just fetch the new today and update the state
    // await buildStateWorkspace(props.token, workspaces);
    setLoading(false);
  };

  return (
    <DialogContent className="bg-dashboard sm:rounded-[10px] py-6 text-focus-text-hover border-nonfocus-text border-none max-w-[100vw] w-[55vw] max-h-[100vh] h-[80vh]">
      <div className="w-full grid grid-cols-5 gap-x-6">
        <div className="col-span-4 flex flex-col justify-between min-h-72">
          <div className="flex flex-row text-focus-text-hover gap-3">
            <div className="">
              {props.item.effort ? (
                <GetPriority
                  color="text-focus-text"
                  value={props.item.effort}
                />
              ) : null}
            </div>
            <div className="text-left flex-grow flex flex-col gap-6">
              <input
                type="text"
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
                className="bg-transparent text-xl border-none py-0"
              />
              <div className="flex items-center gap-1">
                <span className="text-sm px-1 rounded-md bg-nonfocus-text">
                  add to cycle
                </span>
                <span className="text-sm px-1 rounded-md bg-nonfocus-text">
                  roadmap
                </span>
              </div>
              <div
                contentEditable={true}
                id="ItemDescription"
                onBlur={handleInput}
                className="border-none text-sm focus:outline-none bg-transparent p-2 text-focus-text h-[52vh] overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: itemDec }}
              />
            </div>
            <Link
              className="text-nonfocus-text hover:text-focus-text-hover active:scale-100"
              href={`/${slug}/${props.spaceName}/item/${props.item._id}`}
            >
              <Maximize2 size={18} />
            </Link>
          </div>
          {/* <DialogFooter className="flex items-center justify-end gap-2 my-4">
            <DialogClose
              onClick={() => setUpdatedItem(props.item)}
              className="bg-transparent text-xs border border-nonfocus-text hover:border-focus-text hover:bg-gray-600/30 text-white p-2 rounded-lg flex justify-center items-center"
            >
              Cancel
            </DialogClose>
            <NextButton
              text="Update"
              type="submit"
              loading={loading}
              handleClick={handleUpdate}
              disabled={!changed}
              className={`text-black text-xs w-fit px-2 ${
                changed ? "" : "bg-focus-text"
              }`}
            />
          </DialogFooter> */}
        </div>
        <div className="text-sm flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <p className="text-xs text-focus-text">Assignees</p>
            {/* assignees Selector */}
            <AssigneeSelector
              selectedMem={selectedMem}
              setSelectedMem={setSelectedMem}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-xs text-focus-text">Priority</p>
            {/* Priority Selector */}
            <StatusSelector
              statuses={efforts}
              status={selectEffort}
              setStatus={setSelectEffort}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-xs text-focus-text">Status</p>
            {/* Status Selector */}
            <StatusSelector
              statuses={statuses}
              setStatus={setSelectedStatus}
              status={selectedStatus}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-xs text-focus-text">Start Date</p>
            <DatePicker text="Start" date={startdate} setDate={setStartDate} />
          </div>

          <div className="flex flex-col gap-y-2">
            <p className="text-xs text-focus-text">End Date</p>
            <DatePicker text="End" date={enddate} setDate={setEndDate} />
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default ItemDialog;
