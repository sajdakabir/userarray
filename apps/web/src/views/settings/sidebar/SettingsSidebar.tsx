"use client";

import { ChevronLeft, CircleUser, Settings2, Shell } from "lucide-react";
import Link from "next/link";
import EachSpaceSettings from "./SpaceSettingsBar";
import { dataStore, userStore } from "@/utils/store/zustand";

const SettingsSidebar = () => {
  const navLinks =
    "hover:text-focus-text-hover text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md hover:bg-sidebar-button-hover";

  // Global states
  const slug = userStore((state) => state.slug);
  const active = userStore((state) => state.current);

  const stateStorage = dataStore((state) => state.stateStorage);
  if (!stateStorage) return null;

  const findActive = (active: string, name: string) => {
    if (active === `${name}-gen`) return "general";
    if (active === `${name}-leb`) return "labels";
    if (active === `${name}-arc`) return "archive";
    if (active === name) return "none";
    return "none";
  };

  return (
    <section className="h-screen bg-sidebar hidden md:flex w-60 pb-2 pt-12 pl-2 text-focus-text-hover font-medium select-none">
      <Link
        className="fixed top-4 left-2 flex bg-sidebar hover:bg-gray-600/30 text-focus-text-hover items-center gap-1 text-hx rounded-lg p-[6px] pr-3"
        href={`/${slug}/today`}
      >
        <ChevronLeft size={18} />
        Back
      </Link>
      <div className="h-full text-sm overflow-y-auto flex flex-grow flex-col justify-start gap-y-6 py-6 px-2 text-focus-text">
        <div className="">
          <p className="flex items-center gap-2">
            <Shell size={18} />
            Workspace settings
          </p>

          <div className="text-hx my-2 flex flex-col gap-1 mt-2 pl-3">
            <Link
              className={`${navLinks} ${
                active === "workGen"
                  ? "bg-sidebar-button-active text-focus-text-hover"
                  : ""
              }`}
              href={`/${slug}/settings`}
            >
              General
            </Link>
            <Link
              className={`${navLinks} ${
                active === "workMem"
                  ? "bg-sidebar-button-active text-focus-text-hover"
                  : ""
              }`}
              href={`/${slug}/settings/members`}
            >
              Members
            </Link>
          </div>
        </div>

        {stateStorage.spaces.length > 0 ? (
          <div className="">
            <p className="flex items-center gap-2">
              <Settings2 size={18} />
              Space settings
            </p>
            <div className="mt-2">
              <div className="flex flex-col gap-2">
                {stateStorage.spaces.map((space, index) => (
                  <EachSpaceSettings
                    key={index}
                    slug={slug}
                    space={space}
                    activeSection={findActive(active, space.name)}
                    isOpen={index <= 4 ? true : false}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <div className="">
          <p className="flex items-center gap-2">
            <CircleUser size={18} />
            Account settings
          </p>

          <div className="text-hx my-2 flex flex-col mt-2 pl-3">
            <Link
              className={`${navLinks} ${
                active === "profile"
                  ? "bg-sidebar-button-active text-focus-text-hover"
                  : ""
              }`}
              href={`/${slug}/settings/profile`}
            >
              General
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SettingsSidebar;
