"use client";

import { useEffect, useState } from "react";
import Spinner from "@/components/loaders/Spinner";
import { dataStore, userStore } from "@/utils/store/zustand";
import { ReactNode } from "react";
import { Workspace } from "@/lib/types/Workspaces";

interface Props {
  children: ReactNode;
  slug: string;
  token: string;
  workspces: Workspace[];
  thisWorkspace: number;
}

const DataProvider = (props: Props) => {
  const [loaded, setLoaded] = useState(false);

  const fetchUser = dataStore((state) => state.fetchUser);
  const setWorkspaces = dataStore((state) => state.setWorkspaces);
  const setSlug = userStore((state) => state.setSlug);

  const dayBoards = dataStore((state) => state.dayBoards);
  const fetchCurrentUserToday = dataStore(
    (state) => state.fetchCurrentUserToday
  );
  const stateStorage = dataStore((state) => state.stateStorage);
  const buildStateStorage = dataStore((state) => state.buildStateStorage);

  // Execute only once
  useEffect(() => {
    fetchUser(props.token);
    setSlug(props.slug);
    setWorkspaces(props.workspces);
    fetchCurrentUserToday(props.token, props.slug);
    buildStateStorage(
      props.token,
      props.slug,
      props.workspces[props.thisWorkspace]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If state storage is loaded
  useEffect(() => {
    // Ensure that the state storage is loaded and the dayBoards array is not empty before setting the loaded state
    if (stateStorage !== null && dayBoards.length > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [stateStorage, dayBoards]);

  if (!loaded) {
    // Render spinner until data is loaded
    return <Spinner />;
  }

  return <>{props.children}</>;
};

export default DataProvider;
