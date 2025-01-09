"use client";

import { User } from "@/lib/types/Users";
import { useEffect, useMemo } from "react";
import { dataStore } from "@/utils/store/zustand";
import Spinner from "@/components/loaders/Spinner";
import { useRouter } from "next/navigation";

const WorkspaceFinder = (props: { accessToken: string; user: User }) => {
  const stateStorage = dataStore((state) => state.stateStorage);
  const router = useRouter();
  const myTeams = dataStore((state) => state.myTeams);

  const fetchTeam = dataStore((state) => state.fetchMyTeams);

  // const spaces = useMemo(() => {
  //   if (!stateStorage) return [];
  //   return stateStorage.spaces;
  // }, [stateStorage]);

  useEffect(() => {
    fetchTeam(props.accessToken);
  }, []);
  useEffect(() => {
    const workspaceName = localStorage.getItem("workspace_slug");

    // Proceed if workspaces exist and workspaceName is found in localStorage
    if (workspaceName && myTeams !== null && myTeams.length > 0) {
      // Navigate to the correct workspace's cycle page
      router.push(`/${workspaceName}/${myTeams[0]._id}/cycle`);
    }
  }, [myTeams]);

  return <Spinner />;
};

export default WorkspaceFinder;
