"use client";

import { FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserProfile } from "@/types/Users";
import { User } from "lucide-react";
import Image from "next/image";

interface TopBarProps {
  myProfile: UserProfile | null;
  workspace: string;
}

const TopBar: FC<TopBarProps> = ({ workspace, myProfile }) => {
  const pathname = usePathname();
  const isActivePath = (path: string) => pathname.includes(path);

  return (
    <div className="h-16 border-b border-[#E3E3E3] bg-white sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto h-full flex items-center text-sm">
        <div className="w-[240px] pl-12">
          {/* Logo and Name */}
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
        </div>

        <div className="flex items-center">
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
              href={`/${workspace}/plan`}
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
      </div>
    </div>
  );
};

export default TopBar;
