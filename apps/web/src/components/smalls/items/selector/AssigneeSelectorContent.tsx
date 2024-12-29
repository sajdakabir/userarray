import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import { dataStore } from "@/utils/store/zustand";
import { Check } from "lucide-react";
import { FC } from "react";

type AssigneeSelectorContentProps = {
  selectedMem: WorkspaceMember[];
  setSelectedMem: (selectedMem: WorkspaceMember[]) => void;
};

const AssigneeSelectorContent: FC<AssigneeSelectorContentProps> = ({
  selectedMem,
  setSelectedMem,
}) => {
  const stateStorage = dataStore((state) => state.stateStorage);

  if (!stateStorage) return null;
  const members = stateStorage.members;

  return (
    <div className="flex flex-col gap-[2px]">
      {members.map((mem) => (
        <DropdownMenuItem
          key={mem.member.fullName}
          onClick={() => {
            if (!selectedMem.some((a) => a._id === mem._id)) {
              setSelectedMem([...selectedMem, mem]);
            } else {
              setSelectedMem(
                selectedMem.filter((mem_) => mem._id !== mem_._id)
              );
            }
          }}
          className={`text-xs group py-1 pl-2 pr-4 rounded-md hover:bg-sidebar-button-hover hover:text-focus-text-hover text-left w-full`}
        >
          <p className="flex items-center">
            {selectedMem.some(
              (a) => JSON.stringify(a) == JSON.stringify(mem)
            ) ? (
              <Check
                className="mr-2 text-less-highlight"
                size={14}
                strokeWidth={2.5}
              />
            ) : (
              <Check
                className="mr-2 text-nonfocus-text opacity-0 group-hover:opacity-50 duration-150"
                size={14}
              />
            )}
            <span className="flex items-center gap-2 capitalize">
              {mem.member.userName || mem.member.fullName}
            </span>
          </p>
        </DropdownMenuItem>
      ))}
    </div>
  );
};

export default AssigneeSelectorContent;
