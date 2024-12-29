"use client";

import { PendingInvitation } from "@/lib/types/Workspaces";
import { FC, useState } from "react";
import AcceptInvitation from "./AcceptInvitation";
import CreateWorkspace from "./CreateWorkspace";

type ManageWorkspaceProps = {
  token: string;
  invitations: PendingInvitation[];
};

const ManageWorkspace: FC<ManageWorkspaceProps> = ({ token, invitations }) => {
  const [joinPage, setJoinPage] = useState<boolean>(invitations.length > 0);

  return (
    <>
      {joinPage ? (
        <AcceptInvitation
          accessToken={token}
          invitations={invitations}
          swichMode={() => setJoinPage(false)}
        />
      ) : (
        <CreateWorkspace accessToken={token} />
      )}
    </>
  );
};

export default ManageWorkspace;
