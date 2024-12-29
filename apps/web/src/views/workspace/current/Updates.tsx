"use client";

import { dataStore, userStore } from "@/utils/store/zustand";
import { useEffect } from "react";

const UpdatesClient = (props: { token: string; slug: string }) => {
  // Global state
  const stateStorage = dataStore((state) => state.stateStorage);
  const setCurrent = userStore((state) => state.setCurrent);
  const setSlug = userStore((state) => state.setSlug);

  useEffect(() => {
    setCurrent(`${props.slug}-updates`);
    setSlug(props.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="min-h-screen overflow-y-auto px-12 py-8 flex-grow right-0 bg-dashboard grid place-content-center">
      <h3 className="text-focus-text">You are all clear</h3>
    </section>
  );
};

export default UpdatesClient;
