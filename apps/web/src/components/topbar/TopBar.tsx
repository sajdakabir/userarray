"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfile } from "@/types/Users";
import { User, LogOut } from "lucide-react";
import Image from "next/image";
import CustomLogout from "@/server/actions/auth/custom-logout";

interface TopBarProps {
  myProfile: UserProfile | null;
  workspace: string;
}

const TopBar = ({ workspace, myProfile }: TopBarProps) => {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const isActivePath = (path: string) => pathname.includes(path);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await CustomLogout();
      // CustomLogout redirects, so we won't reach here
    } catch (error) {
      // NEXT_REDIRECT is not an error - let it propagate
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = error as any;
      if (e.message === "NEXT_REDIRECT") {
        return; // Allow redirect to happen
      }
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="h-16 border-b border-[#E3E3E3] bg-white sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto h-full flex items-center justify-between text-sm px-12">
        <div className="flex items-center gap-6">
          {/* Logo and Workspace Section */}
          <div className="flex items-center gap-1.5">
            {/* Profile Section */}
            <button className="p-1.5 rounded-full hover:bg-[#F8F8F8] transition-colors">
              {myProfile?.avatar ? (
                <div>
                  <Image
                    src={myProfile.avatar}
                    width={24}
                    height={24}
                    className="rounded-full"
                    alt={myProfile.firstName ?? "Profile Picture"}
                  />
                </div>
              ) : (
                <User size={18} className="text-[#666]" />
              )}
            </button>

            <Link
              href="#"
              className="flex items-center text-[#666] hover:text-black transition-colors text-sm"
            >
              <span className="font-medium">userarray</span>
            </Link>

            {/* Separator */}
            <span className="text-[#E3E3E3] mx-1.5">/</span>

            {/* Workspace Name */}
            <button
              disabled
              className="text-[#666] font-medium  transition-colors text-sm"
            >
              {workspace}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href={`/${workspace}/feedback`}
              className={`px-2 py-1 transition-colors ${
                isActivePath("/feedback")
                  ? "text-black font-medium"
                  : "text-[#666] hover:text-black"
              }`}
            >
              Feedback
            </Link>
            <Link
              href={`/${workspace}/issue`}
              className={`px-2 py-1 transition-colors ${
                isActivePath("/plan")
                  ? "text-black font-medium"
                  : "text-[#666] hover:text-black"
              }`}
            >
              All Issues
            </Link>
            <Link
              href={`/${workspace}/cycle`}
              className={`px-2 py-1 transition-colors ${
                isActivePath("/cycle")
                  ? "text-black font-medium"
                  : "text-[#666] hover:text-black"
              }`}
            >
              Current Cycle
            </Link>
          </div>
        </div>

        {/* Logout Button - Fixed at Right */}
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#666] hover:text-black hover:bg-[#F8F8F8] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Logout"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
