"use client";

import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { NextButton } from "@/components/ui/custom-buttons";
import { toast } from "@/components/ui/use-toast";
import { PendingInvitation } from "@/lib/types/Workspaces";
import { GetAvatarFromName } from "@/utils/helpers";
import axios, { AxiosError } from "axios";
import { Plus, ReplyAll } from "lucide-react";
import { FC, useState } from "react";

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
  const [loading, setLoading] = useState<boolean>(false);

  const handleJoinWorkspace = async (invitation: PendingInvitation) => {
    setLoading(true);
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
    setLoading(false);
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
            <div key={x._id} className="flex w-full flex-col gap-y-0 text-left">
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
                  handleClick={() => handleJoinWorkspace(x)}
                  className="text-sm w-fit px-2 py-[2px] rounded-md font-normal"
                  loading={loading}
                />
              </div>
            </div>
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
