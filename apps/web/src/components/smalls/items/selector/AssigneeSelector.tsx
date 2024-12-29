import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FC } from "react";
import { WorkspaceMember } from "@/lib/types/Workspaces";
import { User } from "lucide-react";
import UserAvatar from "../../avatar/UserAvatar";
import AssigneeSelectorContent from "./AssigneeSelectorContent";

type AssigneeSelectProps = {
  selectedMem: WorkspaceMember[];
  setSelectedMem: (selectedMem: WorkspaceMember[]) => void;
};

const AssigneeSelector: FC<AssigneeSelectProps> = ({
  selectedMem,
  setSelectedMem,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          {selectedMem.length === 0 ? (
            <div className="border w-fit border-item-border text-focus-text hover:text-focus-text-hover p-1 rounded-full hover:bg-gray-600/30">
              <User size={16} />
            </div>
          ) : (
            <div className="flex items-center text-[10px] cursor-default">
              {selectedMem.map((m, index) => (
                <UserAvatar
                  key={m._id}
                  name={m.member.fullName}
                  index={index}
                  size={7}
                  image={m.member.avatar}
                  className="border-dashboard"
                />
              ))}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-sidebar ml-20 mt-2 rounded-[10px] p-1 text-focus-text border-sidebar-button-active w-fit min-w-24">
        <AssigneeSelectorContent
          selectedMem={selectedMem}
          setSelectedMem={setSelectedMem}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AssigneeSelector;
