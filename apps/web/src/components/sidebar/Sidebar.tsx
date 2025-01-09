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
    <section className=" px-52 bg-zinc-800 w-full flex  items-center">
      
      <div className="h-full w-full flex flex-row  items-center justify-between text-white">
        <SideHeader accessToken={accessToken} />
        
        <div className="flex flex-col h-full justify-between pb-3 overflow-y-auto">
          <Spaces accessToken={accessToken} />
        </div>
        <SideFooter />
      </div>
    </section>
  );
};

export default Sidebar;
