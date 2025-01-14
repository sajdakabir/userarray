"use client";
import LogOut from "@/server/actions/auth/logout";
import { GetAvatarFromName } from "@/utils/helper";
import React from "react";
import Link from "next/link";
import { Orbit, Zap } from "lucide-react";
import { User } from "@/types/Users";
import { Workspace } from "@/types/workspace";
import Image from "next/image";
import { usePathname } from "next/navigation";
// Define types for the props (user and workSpace)
interface HeaderProps {
  user: User | null;
  workSpace: Workspace | null;
}

const Header: React.FC<HeaderProps> = ({ user, workSpace }) => {
  const path = usePathname();

  const handleLogout = async () => {
    await LogOut(); // Perform logout
  };

  return (
    <section className="px-52 bg-zinc-800 w-full flex items-center">
      <div className="h-full w-full flex flex-row items-center justify-between text-white">
        <div className="bg-highlight h-5 w-5 leading-none rounded-md text-black uppercase grid place-content-center">
          <Link href={`#`}>{workSpace?.name.charAt(0)}</Link>
        </div>

        <div className="flex flex-col h-full justify-between pb-3 overflow-y-auto">
          <div className="flex flex-col h-full justify-between pb-3 overflow-y-auto">
            <div className="flex mt-2 pl-3 gap-[2px]">
              {/* Cycle Link */}
              
              {workSpace?.slug?<Link
                  href={`/${workSpace.slug}/feedback`}
                  className="text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider text-zinc-100"
                >
                  <Zap size={14} />
                  Feedback
                </Link>:<Link
                  href={`#`}
                  className="text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider text-zinc-100"
                >
                  <Zap size={14} />
                  Cycle
                </Link>}


              {workSpace?.slug ? (
                <Link
                  href={`/${workSpace.slug}/cycle`}
                  className="text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider text-zinc-100"
                >
                  <Zap size={14} />
                  Cycle
                </Link>
              ) : (
                <Link
                href={`/${path.split("/")[1]}/cycle`}
                className="text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider text-zinc-100"
              >
                <Zap size={14} />
                Cycle
              </Link>
              )}

              {/* Plan Link */}
              {workSpace?.slug ? (
                <Link
                  href={`/${workSpace.slug}/plan`}
                  className="text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider text-zinc-100"
                >
                  <Orbit size={14} />
                  Plan
                </Link>
              ) : (
                <Link
                href={`/${path.split("/")[1]}/plan`}
                className="text-hx flex items-center gap-2 justify-start px-2 py-1 rounded-md border border-transparent hover:border-divider text-zinc-100"
              >
                <Orbit size={14} />
                Plan
              </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <div className="flex text-sm font-medium items-center gap-2 text-white">
              {user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <Image
                  src={user.avatar}
                  width={20}
                  height={20}
                  alt="avatar"
                  className="h-5 w-5 rounded-md bg-avatar"
                />
              ) : (
                <div className="text-[10px] h-5 w-5 bg-less-highlight text-black font-semibold rounded-md grid place-content-center">
                  {user?.firstName
                    ? GetAvatarFromName(user.firstName, user.lastName ?? "")
                    : ""}
                </div>
              )}
            </div>
          )}

          {/* Add logout button if needed */}
          {user ? (
            <button onClick={handleLogout} className="text-sm text-red-500">
              Logout
            </button>
          ) : (
            <Link href={"/"}  className="text-sm text-red-500">
              Login
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default Header;
