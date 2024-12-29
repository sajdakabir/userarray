"use client";

import Spaces from "./teamspaces/Spaces";
import SideHeader from "./header/SideHeader";
import SideFooter from "./footer/SideFooter";
import Pinned from "./pinned/Pinned";

type SidebarProps = {
  accessToken: string;
};

const Sidebar: React.FC<SidebarProps> = ({ accessToken }) => {
  return (
    <section className="h-screen bg-sidebar hidden md:flex md:min-w-60 max-w-60 px-2 py-2 text-focus-text-hover font-medium select-none">
      <div className="h-full w-full flex flex-col justify-start">
        <SideHeader accessToken={accessToken} />
        <Pinned />
        <div className="flex flex-col h-full justify-between pb-3 overflow-y-auto">
          <Spaces accessToken={accessToken} />
        </div>
        <SideFooter />
      </div>
    </section>
  );
};

export default Sidebar;
