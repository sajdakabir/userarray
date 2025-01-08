"use client";

import {
  LogOut as Logout,
  MailPlus,
  MessageSquare,
  Settings,
  LucideHelpCircle,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogOut from "@/server/actions/auth/logout";
import { GetAvatarFromName } from "@/utils/helpers";
import Link from "next/link";

import { dataStore, userStore } from "@/utils/store/zustand";
import Discord from "@/components/smalls/custom-icons/Discord";

const SideFooter = () => {
  const slug = userStore((state) => state.slug);
  const setSlug = userStore((state) => state.setSlug);
  const setSidebar = userStore((state) => state.setSidebar);

  const user = dataStore((state) => state.user);

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    // erase user preferences before logging out
    setSlug("");
    setSidebar(false);
    await LogOut();
  };

  return (
    <div className="flex flex-col bottom-0 left-0 max-w-72 bg-sidebar">
      <div
        id="seperator"
        className="h-[1px] bg-classic-button-hover mx-2 mb-1"
      ></div>

      <div className="flex flex-col">
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none focus:outline-none group">
            <div className="flex text-focus-text hover:text-focus-text-hover items-center text-sm gap-2 px-2 py-[6px] w-full group-data-[state=open]:bg-sidebar-button-active group-data-[state=open]:text-focus-text-hover rounded-lg">
              <LucideHelpCircle size={16} />
              <span>Help and Support</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="font-medium border border-divider text-hx text-focus-text w-52 py-2 select-none rounded-lg px-0 ml-[15.5rem] -mb-10 z-20 bg-sidebar shadow-lg shadow-bg-gradient-dark">
            <div className="text-nonfocus-text text-xs mx-3 my-1">
              Instant chat
            </div>
            <div className="pr-2">
              <Link
                href="mailto:satellite@trymarch.dev"
                className="hover:text-focus-text-hover mx-1 text-sm flex items-center gap-2 hover:bg-sidebar-button-active w-full px-2 py-1 rounded-lg"
              >
                <MailPlus size={16} />
                Email Us
              </Link>
              <Link
                href="imessage://oliursahin@icloud.com"
                className="hover:text-focus-text-hover mx-1 text-sm flex items-center gap-2 hover:bg-sidebar-button-active w-full px-2 py-1 rounded-lg"
              >
                <MessageSquare size={16} />
                iMessage (faster)
              </Link>
              <Link
                href="https://discord.gg/qpgZqt2cag"
                className="hover:text-focus-text-hover mx-1 text-sm flex items-center gap-2 hover:bg-sidebar-button-active w-full px-2 py-1 rounded-lg"
              >
                <Discord />
                Join Discord
              </Link>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="mt-1 group border border-divider outline-none focus:outline-none text-focus-text hover:text-focus-text-hover flex justify-between items-center gap-2 px-2 py-[6px] w-full bg-sidebar-button-hover hover:bg-sidebar-button-active rounded-lg hover:shadow-md hover:shadow-black/45">
          <div className="flex text-sm font-medium items-center gap-2">
            {user.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar}
                alt="avatar"
                className="h-5 w-5 rounded-md bg-avatar"
              />
            ) : (
              <div className="text-[10px] h-5 w-5 bg-less-highlight text-black font-semibold rounded-md grid place-content-center">
                {user.firstName ? GetAvatarFromName(user.firstName, user.lastName ?? '') : ''}
              </div>
            )}
            {user.firstName}
          </div>
          <ChevronUp
            className="group-data-[state=open]:rotate-90 duration-300"
            size={18}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent className="min-w-52 border border-divider font-medium text-hx text-focus-text py-2 select-none rounded-lg px-0 ml-[15.5rem] -mb-9 z-20 bg-sidebar shadow-lg shadow-bg-gradient-dark">
          <div className="text-xs px-4 text-nonfocus-text flex flex-col gap-1">
            <span>{user.firstName} {user.lastName}</span>
            <span>
              {user.accounts.local.email || user.accounts.google.email}
            </span>
          </div>
          <div className="bg-classic-button-hover mx-4 mt-2 mb-1 h-[1px]" />
          <div className="pr-2 select-none">
            <Link
              href={`/${slug}/settings/profile`}
              className="hover:text-focus-text-hover mx-1 text-sm flex items-center gap-2 hover:bg-sidebar-button-active w-full px-2 py-1 rounded-lg"
            >
              <Settings size={14} />
              Account Settings
            </Link>
            <button
              onClick={handleLogout}
              className="hover:text-focus-text-hover mx-1 text-sm flex items-center gap-2 hover:bg-sidebar-button-active w-full px-2 py-1 rounded-lg"
            >
              <Logout size={14} />
              Log Out
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SideFooter;
