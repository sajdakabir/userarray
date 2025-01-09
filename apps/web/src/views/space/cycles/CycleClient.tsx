"use client";

import { statuses } from "@/lib/types/Items";
import { dataStore, userStore } from "@/utils/store/zustand";
import { useEffect } from "react";

import { usePathname } from "next/navigation";
import { Orbit } from "lucide-react";
import IssueCard from "@/components/issueCard/IsshueCard";

const CycleClient = (props: { token: string; slug: string; space: string }) => {
  
  const pathname = usePathname();
  const setCurrent = userStore((state) => state.setCurrent);
  const allIssues = dataStore((state) => state.fetchAllIssues);
  const cycleIssueStatus = dataStore((state) => state.cycleIssueStatus);
  const cycleAllLinearIssues = dataStore((state) => state.cycleAllLinearIssues);
  
  useEffect(() => {
    allIssues(props.token, pathname.split("/")[2], "cycle");
  }, [pathname.split("/")[2]]);

  
 
  useEffect(() => {
    setCurrent(`${props.space}-plan`);
  }, [props.space, setCurrent]);

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };


  return (
    <section className="h-screen flex flex-col gap-y-12 flex-grow right-0 bg-dashboard pt-8 z-50 ">
      <div className="mx-20">
        <h2 className="text-xl flex items-center font-medium text-focus-text-hover">
          <Orbit className="mr-2" size={20} />
          Plan
        </h2>
        <h4 className="text-focus-text text-sm mt-2 flex items-center">
          All your work items: your playground from where you push things to be
          executed.
        </h4>
      </div>

      <IssueCard issue={cycleAllLinearIssues} token={props.token} issueStatus={cycleIssueStatus} />
    </section>
  );
};

export default CycleClient;
