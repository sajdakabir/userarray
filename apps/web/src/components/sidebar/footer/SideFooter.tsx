"use client";

import LogOut from "@/server/actions/auth/logout";
import { GetAvatarFromName } from "@/utils/helpers";
import { dataStore, userStore } from "@/utils/store/zustand";
import { FC, useEffect } from "react";
import Discord from "@/components/smalls/custom-icons/Discord";

// Define the props for the component
interface AccessTokenProps {
  accessToken: string;
}

const SideFooter: FC<AccessTokenProps> = ({ accessToken }) => {
  // Access the user state and store actions
  const setSlug = userStore((state) => state.setSlug);
  const fetchMyAccount = dataStore((state) => state.fetchUser);
  const user = dataStore((state) => state.user);

  useEffect(() => {
    // Fetch user account information on component mount
    fetchMyAccount(accessToken);
  }, [accessToken, fetchMyAccount]);

  const handleLogout = async () => {
    // Erase user preferences before logging out
    setSlug("");

    await LogOut(); // Perform logout
  };


  return (
    <div className="flex items-center gap-2">
      <div className="flex text-sm font-medium items-center gap-2 text-white">
        
        {user?.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.avatar}
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

      {/* Add logout button if needed */}
      <button onClick={handleLogout} className="text-sm text-red-500">
        Logout
      </button>
    </div>
  );
};

export default SideFooter;
