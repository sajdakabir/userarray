"use client";

import EachSpace from "./EachSpace";
import { Orbit, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { dataStore } from "@/utils/store/zustand";

const Spaces = (props: { accessToken: string }) => {
  const router = useRouter();
  const myTeams = dataStore((state) => state.myTeams);
  const fetchTeam = dataStore((state) => state.fetchMyTeams);
  const [workspace, setWorkspace] = useState<string | null>(null);

  useEffect(() => {
    const workspaceSlug = localStorage.getItem("workspace_slug");
    if (workspaceSlug) {
      setWorkspace(workspaceSlug);
    } else {
      router.push("/");
      return; // Prevent further execution
    }

    if (props.accessToken) {
      fetchTeam(props.accessToken);
    }
  }, [props.accessToken, router, fetchTeam]);

  if (!myTeams.length) {
    return (
      <div className="flex items-center gap-3 text-sm text-zinc-600">
        <button className="flex gap-1 mt-2 items-center" disabled>
          <Zap size={14} /> Cycle
        </button>
        <button className="flex gap-1 mt-2 items-center" disabled>
          <Orbit size={14} /> Plan
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {myTeams.length > 0 ? (
        <div className="flex flex-col gap-2 w-full pr-2">
          {myTeams.map((space) => (
            <EachSpace space={space} key={space._id}  workspace={workspace ?? ""}  />
          ))}
        </div>
      ) : (
        <div className="pr-2 mt-16 max-w-60 flex flex-col gap-y-4 text-center text-focus-text text-sm">
          <p className="px-4">Your workspace is empty!</p>
          <button className="underline text-focus-text-hover">
            Create a space
          </button>
          <p className="px-6">To organize your team works</p>
        </div>
      )}
    </div>
  );
};

export default Spaces;
