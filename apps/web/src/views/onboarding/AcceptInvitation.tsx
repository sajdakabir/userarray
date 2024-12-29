"use client";

import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { toast } from "@/components/ui/use-toast";
import { PendingInvitation } from "@/lib/types/Workspaces";
import axios, { AxiosError } from "axios";
import { Plus } from "lucide-react";
import { FC } from "react";
import Invitation from "./Invitation";

type AcceptInvitationProps = {
  accessToken: string;
  invitations: PendingInvitation[];
  swichMode: () => void;
};

const AcceptInvitation: FC<AcceptInvitationProps> = ({
  accessToken,
  invitations,
  swichMode,
}) => {
  const joinWorkspace = async (invitation: PendingInvitation) => {
    const slug = invitation.workspace.slug;
    const invitationId = invitation.uuid;
    try {
      const { data } = await axios.post(
        USER_WORKSPACE + `/${slug}/invitations/${invitationId}/join`,
        null,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      console.log(data);
    } catch (error) {
      const e = error as AxiosError;
      console.error(e.response?.data);
      toast({
        variant: "destructive",
        title: "Could not join workspace",
      });
    }
    window.location.href = `/${slug}/today`;
  };

  return (
    <main className="min-h-screen bg-sidebar grid place-content-center">
      <h2 className="text-focus-text-hover text-2xl font-medium mb-6 text-center">
        Join a workspace
      </h2>
      <section className="md:w-96 w-96 p-6 pb-8 bg-dashboard rounded-xl shadow-xl shadow-black/30">
        <div className="flex flex-col gap-y-4 items-center">
          {invitations.map((x) => (
            <Invitation key={x._id} x={x} joinWorkspace={joinWorkspace} />
          ))}
        </div>
      </section>

      <button
        onClick={swichMode}
        className="mt-6 w-fit shadow-lg shadow-black/40 mx-auto bg-transparent text-xs border border-nonfocus-text hover:border-focus-text hover:bg-gray-600/30 text-focus-text-hover px-2 py-[6px] rounded-lg flex items-center gap-x-1"
      >
        <Plus size={14} /> Create workspace
      </button>
    </main>
  );
};

export default AcceptInvitation;
