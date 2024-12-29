import { NextButton } from "@/components/ui/custom-buttons";
import { PendingInvitation } from "@/lib/types/Workspaces";
import { GetAvatarFromName } from "@/utils/helpers";
import { ReplyAll } from "lucide-react";
import React, { FC, useState } from "react";

type InvitationProps = {
  x: PendingInvitation;
  joinWorkspace: (invitation: PendingInvitation) => Promise<void>;
};

const Invitation: FC<InvitationProps> = ({ x, joinWorkspace }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleJoinWorkspace = async () => {
    setLoading(true);
    await joinWorkspace(x);
    setLoading(false);
  };
  return (
    <div className="flex w-full flex-col gap-y-0 text-left">
      <p className="ml-2 flex items-center gap-x-1 text-xs text-nonfocus-text">
        {x.createdBy.fullName} <ReplyAll size={12} />
      </p>
      <div className="flex item hover:scale-100 px-3 py-2 text-sm items-center justify-between">
        <div className="flex items-center gap-x-2">
          <div className="h-7 w-7 rounded-lg bg-less-highlight-chip grid place-content-center text-xs text-white font-medium">
            {GetAvatarFromName(x.workspace.name)}
          </div>
          <p className="text-focus-text-hover">{x.workspace.name}</p>
        </div>

        <NextButton
          text="Join"
          handleClick={() => handleJoinWorkspace()}
          className="text-sm w-fit px-2 py-[2px] rounded-md font-normal"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Invitation;
