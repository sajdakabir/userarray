"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { dataStore } from "@/utils/store/zustand";
import Spinner from "@/components/loaders/Spinner";

const SideHeader = (props: { accessToken: string }) => {
  const workspaces = dataStore((state) => state.workspaces);
  const fetchWorkSpaces = dataStore((state) => state.fetchWorkspaces);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkSpaces(props.accessToken);
  }, [props.accessToken, fetchWorkSpaces]);

  

 

  return (
    <div id="">
      <div className="bg-highlight h-5 w-5 leading-none rounded-md text-black uppercase grid place-content-center">
       
         <Link href={`#`}>{workspaces[0]?.name.charAt(0)}</Link>
      
      </div>
    </div>
  );
};

export default SideHeader;
