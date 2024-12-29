"use client";

import {
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { FC, useState } from "react";
import SpaceSelector from "../items/selector/SpaceSelector";
import AssigneeSelector from "../items/selector/AssigneeSelector";
import { TextEditor } from "../editor/RichEditor";
import { NextButton } from "@/components/ui/custom-buttons";
import { Label } from "@/lib/types/Labels";
import { StateSpace } from "@/lib/types/States";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import { X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import LabelSelector from "../items/selector/LabelSelector";
import { DatePicker } from "@/components/ui/date-picker";
import axios, { AxiosError } from "axios";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { format } from "date-fns";
import { updateRoadmapState } from "@/utils/state-manager/roadmap-updater";
import { SingleRoadmap } from "@/lib/types/Roadmap";
import { dataStore } from "@/utils/store/zustand";

type CreateRoadmapProps = {
  token: string;
  slug: string;
  spaceIndex: number;
  horizon: "now" | "draft" | "next";
  setIsOpen: (open: boolean) => void;
};

const CreateRoadmap: FC<CreateRoadmapProps> = ({
  token,
  slug,
  spaceIndex,
  horizon,
  setIsOpen,
}) => {
  const stateStorage = dataStore((state) => state.stateStorage);
  const setStateSpaces = dataStore((state) => state.setStateSpaces);

  const [roadmapName, setRoadmapName] = useState<string>("");
  const [roadmapDec, setRoadmapDec] = useState<string>("<p></p>");
  const [loading, setLoading] = useState<boolean>(false);
  const [selLabels, setLabels] = useState<Label[]>([]);
  const [targetDate, setTargetDate] = useState<Date>();
  const [selectedMem, setSelectedMem] = useState<WorkspaceMember[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<StateSpace>(
    stateStorage!.spaces[spaceIndex]
  );

  if (!stateStorage) return null;

  const getSpaceIndex = (spaceId: string) => {
    return stateStorage.spaces.findIndex((space) => space._id === spaceId);
  };

  // Function to handle the creation of the item
  const handleCreate = async () => {
    setLoading(true);
    let res;
    try {
      const { data } = await axios.post(
        `${USER_WORKSPACE}/${slug}/spaces/${selectedSpace.name}/roadmaps`,
        {
          name: roadmapName,
          description: roadmapDec,
          horizon: horizon,
          targetDate: targetDate ? format(targetDate, "yyyy-MM-dd") : null,
          assignees: selectedMem.map((mem) => mem.member._id),
          labels: selLabels.map((label) => label._id),
        },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      res = data as SingleRoadmap;
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.response?.data);
      toast({
        variant: "destructive",
        title: "Could not create roadmap",
      });
    }
    if (res) {
      toast({
        title: "Roadmap successfully created!",
      });
      // reset all the fields
      resetSelection();
      // close the dialog
      setIsOpen(false);
      // update the state
      updateRoadmapState(
        res.response,
        getSpaceIndex(res.response.space),
        stateStorage,
        setStateSpaces,
        "create"
      );
    }
    setLoading(false);
  };

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      // Trigger button click when Enter key is pressed
      if (!roadmapName) return;
      await handleCreate();
    }
  };

  const resetSelection = () => {
    setRoadmapName("");
    setRoadmapDec("<p></p>");
    setLabels([]);
    setSelectedMem([]);
    setTargetDate(undefined);
  };

  return (
    <DialogContent className="bg-dashboard py-4 flex flex-col justify-between rounded-[10px] text-focus-text-hover border-nonfocus-text border-none max-w-[100vw] w-[55vw] h-fit">
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
            {/* <button
              onClick={handleExpand}
              className="p-1 rounded-md hover:bg-gray-600/30"
            >
              <Maximize2 className="hover:text-focus-text" size={16} />
            </button> */}

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
          placeholder="Enter roadmap name"
          value={roadmapName}
          onChange={(e) => {
            setRoadmapName(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          className="bg-transparent text-2xl border-none px-0 mt-2 placeholder:text-focus-text"
          autoFocus={true}
        />
        <div className="flex items-center justify-between text-hx max-h-12 mt-2 mb-5">
          <div className="flex items-center justify-start gap-x-4">
            <DatePicker
              text="Target"
              date={targetDate}
              setDate={setTargetDate}
            />
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
          className="[&>.ProseMirror.tiptap]:min-h-36"
          content={roadmapDec}
          setContent={setRoadmapDec}
        />

        <DialogFooter className="flex items-center justify-end gap-2 mt-4 max-h-12">
          <NextButton
            text="Create"
            loading={loading}
            handleClick={handleCreate}
            disabled={!roadmapName}
            className={`text-black text-sm w-fit px-2 py-[6px] border border-focus-text ${
              roadmapName ? "" : "bg-focus-text"
            }`}
          />
        </DialogFooter>
      </div>
    </DialogContent>
  );
};

export default CreateRoadmap;
