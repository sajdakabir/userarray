import {
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { FC, useEffect, useMemo, useState } from "react";
import { dataStore, userStore } from "@/utils/store/zustand";
import { NextButton } from "@/components/ui/custom-buttons";
import axios, { AxiosError } from "axios";
import { useToast } from "@/components/ui/use-toast";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { SingleItem, Status, efforts, statuses } from "@/lib/types/Items";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import SpaceSelector from "./selector/SpaceSelector";
import StatusSelector from "./selector/StatusSelector";
import { DatePicker } from "@/components/ui/date-picker";
import AssigneeSelector from "./selector/AssigneeSelector";
import LabelSelector from "./selector/LabelSelector";
import { Label } from "@/lib/types/Labels";
import { TextEditor } from "../editor/RichEditor";
import { Cycle } from "@/lib/types/Cycle";
import CycleSelector from "./selector/CycleSelector";
import { StateSpace } from "@/lib/types/States";
import { Maximize2, X } from "lucide-react";
import { getMyItems } from "@/server/fetchers/items/get-workitems";
import { UpdateItemsState } from "@/utils/state-manager/item-updater";
import { useRouter } from "next/navigation";
import { formattedDate } from "@/utils/helpers";

type CreateItemProps = {
  token: string;
  status: Status;
  space: StateSpace;
  addCycle?: Cycle;
  isPlan?: boolean;
  setIsOpen: (open: boolean) => void;
};

const CreateItem: FC<CreateItemProps> = ({
  token,
  status,
  space,
  addCycle,
  isPlan,
  setIsOpen,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  // Global states
  const slug = userStore((state) => state.slug);
  const user = dataStore((state) => state.user);
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateStorage = dataStore((state) => state.setStateStorage);

  // Local states
  const [itemName, setItemName] = useState<string>("");
  const [itemDec, setItemDec] = useState<string>("<p></p>");
  const [loading, setLoading] = useState<boolean>(false);
  const [selLabels, setLabels] = useState<Label[]>([]);
  const [dueDate, setDueDate] = useState<Date>();

  const [cycles, setCycles] = useState<Cycle[]>(addCycle ? [addCycle] : []);
  const [selectedStatus, setSelectedStatus] = useState<Status>(status);
  const [selectEffort, setSelectEffort] = useState<Status | undefined>(
    undefined
  );
  const [selectedSpace, setSelectedSpace] = useState<StateSpace>(space);
  const [selectedMem, setSelectedMem] = useState<WorkspaceMember[]>([]);

  const usableCycles = useMemo<Cycle[]>(() => {
    return [selectedSpace!.cycles.current, ...selectedSpace!.cycles.upcoming];
  }, [selectedSpace]);

  useEffect(() => {
    if (
      (selectedStatus.value === "in progress" ||
        selectedStatus.value === "done") &&
      cycles.length === 0
    )
      setCycles([selectedSpace!.cycles.current]);
  }, [selectedStatus, cycles, selectedSpace]);

  if (!user || !stateStorage) {
    return null;
  }

  const getSpaceIndex = (spaceId: string) => {
    return stateStorage.spaces.findIndex((space) => space._id === spaceId);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Trigger button click when Enter key is pressed
      if (!itemName) return;
      await handleCreate();
    }
  };

  const createWorkItem = async (title: string) => {
    try {
      const { data } = await axios.post(
        USER_WORKSPACE + `/${slug}/spaces/${selectedSpace.name}/items`,
        {
          name: title,
          description: itemDec,
          status: selectedStatus.value,
          effort: selectEffort ? selectEffort.value : "none",
          dueDate: dueDate ? formattedDate(dueDate) : null,
          assignees: selectedMem.map((mem) => mem.member._id),
          labels: selLabels.map((label) => label._id),
          cycles: cycles.map((c) => c._id),
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      const res = data as SingleItem;
      return res;
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.response?.data);
      toast({
        variant: "destructive",
        title: "Something Went Wrong!",
      });
      return null;
    }
  };

  const resetSelection = () => {
    setItemName("");
    setItemDec("<p></p>");
    setLabels([]);
    setSelectedMem([]);
    setCycles(addCycle ? [addCycle] : []);
    setDueDate(undefined);
    setSelectedStatus(status);
    setSelectEffort(undefined);
  };

  const handleExpand = async () => {
    setLoading(true);

    const item_name = itemName || "Untitled item";
    const res = await createWorkItem(item_name);

    if (res) {
      const myItems = await getMyItems(token, slug);
      UpdateItemsState(
        res.response,
        getSpaceIndex(res.response.space),
        myItems,
        stateStorage,
        setStateStorage,
        "create"
      );
      router.push(`/${slug}/${selectedSpace.name}/item/${res.response._id}`);
    } else {
      toast({
        variant: "destructive",
        title: "Could not create item",
      });
    }
    resetSelection();
    setIsOpen(false);
    setLoading(false);
  };

  const handleCreate = async () => {
    setLoading(true);
    const res = await createWorkItem(itemName);
    if (res) {
      toast({
        title: "Item Created successfully!",
      });
      resetSelection();
      setIsOpen(false);
      const myItems = await getMyItems(token, slug);
      UpdateItemsState(
        res.response,
        getSpaceIndex(res.response.space),
        myItems,
        stateStorage,
        setStateStorage,
        "create"
      );
    } else {
      toast({
        variant: "destructive",
        title: "Could not create item",
      });
    }
    setLoading(false);
  };

  return (
    <DialogContent className="bg-dashboard py-4 flex flex-col justify-between rounded-[10px] text-focus-text-hover border-nonfocus-text border-none max-w-[100vw] w-[55vw] max-h-[100vh] min-h-[75vh]">
      <div className="flex flex-col gap-y-3 flex-grow outline-none focus:outline-none">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center justify-start gap-x-4">
            <SpaceSelector space={selectedSpace} setSpace={setSelectedSpace} />

            <AssigneeSelector
              selectedMem={selectedMem}
              setSelectedMem={setSelectedMem}
            />
          </div>

          <div className="flex items-center justify-start gap-x-3 text-nonfocus-text">
            <button
              onClick={handleExpand}
              className="p-1 rounded-md hover:bg-gray-600/30"
            >
              <Maximize2 className="hover:text-focus-text" size={16} />
            </button>

            <DialogClose
              onClick={() => resetSelection()}
              className="p-[2px] rounded-md hover:bg-gray-600/30"
            >
              <X className="hover:text-focus-text" size={20} />
            </DialogClose>
          </div>
        </div>

        <input
          type="text"
          placeholder="Enter work title"
          value={itemName}
          onChange={(e) => {
            setItemName(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-2xl border-none px-0 mt-2 placeholder:text-focus-text"
          autoFocus={true}
        />
        <div className="flex items-center justify-between text-hx max-h-12 mt-2 mb-5">
          <div className="flex items-center justify-start gap-x-4">
            {/* Priority Selector */}
            <StatusSelector
              status={selectEffort}
              setStatus={setSelectEffort}
              statuses={efforts}
            />

            {/* Status Selector */}
            <StatusSelector
              status={selectedStatus}
              setStatus={setSelectedStatus}
              statuses={isPlan ? [statuses[0], statuses[1]] : statuses}
            />

            <DatePicker text="Due" date={dueDate} setDate={setDueDate} />
            {isPlan ? null : (
              <CycleSelector
                cycles={cycles}
                allCycles={usableCycles}
                setCycles={setCycles}
              />
            )}
          </div>

          <div className="z-20">
            <LabelSelector
              space={selectedSpace}
              selLabels={selLabels}
              setLabels={setLabels}
            />
          </div>
        </div>

        <TextEditor
          editable={true}
          className="[&>.ProseMirror.tiptap]:min-h-52"
          content={itemDec}
          setContent={setItemDec}
        />

        <DialogFooter className="flex items-center justify-end gap-2 mt-4 max-h-12">
          <NextButton
            text="Add Item"
            loading={loading}
            handleClick={handleCreate}
            disabled={!itemName}
            className={`text-[14px] text-black rounded-[10px] w-fit px-2 py-[6px] border border-focus-text ${
              itemName ? "" : "bg-focus-text"
            }`}
          />
        </DialogFooter>
      </div>
    </DialogContent>
  );
};

export default CreateItem;
