"use client";

import { User } from "@/lib/types/Users";
import { useCallback, useEffect } from "react";
import { dataStore, userStore } from "@/utils/store/zustand";
import Spinner from "@/components/loaders/Spinner";
import { useRouter } from "next/navigation";

const WorkspaceFinder = (props: { accessToken: string; user: User }) => {
  const slug = userStore((state) => state.slug);
  const setSlug = userStore((state) => state.setSlug);
  const workspaces = dataStore((state) => state.workspaces);
  const setUser = dataStore((state) => state.setUser);

  const fetchWorkspaces = dataStore((state) => state.fetchWorkspaces);

  const router = useRouter();

  // Memoize fetchWorkspaces
  const fetchWorkspacesMemoized = useCallback(fetchWorkspaces, [
    fetchWorkspaces,
  ]);

  useEffect(() => {
    setUser(props.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use a single useEffect for all workspace-related logic
  useEffect(() => {
    // Fetch workspaces if they are not already loaded
    if (workspaces.length === 0) {
      fetchWorkspacesMemoized(props.accessToken);
    }

    // If slug is empty, but workspaces are loaded, set the slug
    if (slug === "" && workspaces.length !== 0) {
      setSlug(workspaces[0].slug);
    }

    // If workspaces are loaded and slug is not empty, navigate to the appropriate route
    if (workspaces.length !== 0 && slug !== "") {
      router.replace(`/${slug}/today`);
    }
  }, [
    workspaces,
    slug,
    fetchWorkspacesMemoized,
    props.accessToken,
    router,
    setSlug,
  ]);

  return <Spinner />;
};

export default WorkspaceFinder;
