"use client";

import { Workspace } from "@/lib/types/Workspaces";
import { Inbox, Activity, ChevronDown, SquarePen, Bell } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import DropContent from "./DropContent";
import Link from "next/link";

import { dataStore, userStore } from "@/utils/store/zustand";
import CreateItem from "../../smalls/items/CreateItem";
import { statuses } from "@/lib/types/Items";

const SideHeader = (props: { accessToken: string }) => {
  // Global states
  const workspaces = dataStore((state) => state.workspaces);
  const stateStorage = dataStore((state) => state.stateStorage);
  const slug = userStore((state) => state.slug);
  const setSlug = userStore((state) => state.setSlug);
  const active = userStore((state) => state.current);
  const setStateNull = dataStore((state) => state.setStateNull);

  // Local States
  const [thisWorkspace, setThisWorkspace] = useState<Workspace>(workspaces[0]);
  const [otherWorkspaces, setOtherWorkspaces] = useState<Workspace[]>([]);
  const [open, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (slug === "") {
      // If no slug was found
      setSlug(workspaces[0].slug);
      setThisWorkspace(workspaces[0]);
    } else if (slug !== undefined) {
      const found = workspaces.find((workspace) => workspace.slug === slug);
      if (found) {
        setThisWorkspace(found);
      } else {
        // Worst case where wrong slug is found in local storage
        setThisWorkspace(workspaces[0]);
        setSlug(workspaces[0].slug);
      }
    }
    // If slug is undefined, then eat 5 star, do nothing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  useEffect(() => {
    // Filter the workspaces array to exclude thisWorkspace
    const filteredWorkspaces = workspaces.filter(
      (workspace) => workspace !== thisWorkspace
    );
    setOtherWorkspaces(filteredWorkspaces);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisWorkspace]);

  const handleSetWorkspace = (slugKey: string) => {
    setSlug(slugKey);
    const foundWorkspace = workspaces.find(
      (workspace) => workspace.slug === slugKey
    );
    if (foundWorkspace) {
      setThisWorkspace(foundWorkspace);
    }
    // Set the State Storage to null
    setStateNull();
    window.location.href = `/${slugKey}/today`;
  };

  if (!stateStorage) return null;

  return (
    <div id="header">
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex-grow group rounded-lg bg-sidebar-button-hover hover:bg-sidebar-button-active outline-none focus:outline-none hover:shadow-md hover:shadow-black/50 flex px-2 py-[6px] justify-between gap-2 items-center">
            <div className="flex justify-start gap-2 items-center">
              <div className="bg-highlight h-5 w-5 leading-none rounded-md text-black uppercase grid place-content-center">
                {thisWorkspace.name.charAt(0)}
              </div>
              <span className="font-medium text-sm">{thisWorkspace.name}</span>
            </div>
            <ChevronDown
              className="group-data-[state=open]:rotate-180 duration-300"
              size={18}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[14rem] select-none rounded-lg mt-1 ml-2 px-0 bg-dashboard border border-divider shadow-lg shadow-bg-gradient-dark text-focus-text-hover">
            <DropContent
              workspaces={otherWorkspaces}
              token={props.accessToken}
              current={thisWorkspace}
              setWorkspace={handleSetWorkspace}
            />
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Create item Button */}
        <Dialog open={open} onOpenChange={setIsOpen}>
          <DialogTrigger asChild={true}>
            <button disabled={stateStorage.spaces.length === 0} className="ml-4 hover:text-focus-text-hover text-hx rounded-lg bg-sidebar-button-hover hover:bg-sidebar-button-active p-[8px]">
              <SquarePen size={15} />
            </button>
          </DialogTrigger>
          {stateStorage.spaces.length > 0 ? (
            <CreateItem
              token={props.accessToken}
              status={statuses[0]}
              space={stateStorage.spaces[0]}
              setIsOpen={setIsOpen}
            />
          ) : null}
        </Dialog>
      </div>

      <div className="my-3 flex flex-col gap-[2px] text-focus-text">
        {/* <Link
          href={`/${slug}/updates`}
          className={`flex justify-start gap-2 items-center text-hx rounded-lg ${
            active === slug + "-updates"
              ? "bg-sidebar-button-active text-focus-text-hover"
              : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
          } px-2 py-[6px]`}
        >
          <Bell className="ml-2" size={14} />
          Updates
        </Link> */}

        <Link
          href={`/${slug}/inbox`}
          className={`flex justify-start gap-2 items-center text-hx rounded-lg ${
            active === slug + "-inbox"
              ? "bg-sidebar-button-active text-focus-text-hover"
              : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
          } px-2 py-[6px]`}
        >
          <Inbox className="ml-2" size={14} />
          Inbox
        </Link>
        <Link
          href={`/${slug}/today`}
          className={`flex justify-start gap-2 items-center text-hx rounded-lg ${
            active === slug + "-today"
              ? "bg-sidebar-button-active text-focus-text-hover"
              : "hover:bg-sidebar-button-hover hover:text-focus-text-hover"
          } px-2 py-[6px]`}
        >
          <Activity className="ml-2" size={14} />
          Today
        </Link>
      </div>
    </div>
  );
};

export default SideHeader;
