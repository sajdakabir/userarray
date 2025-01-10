"use client";

import { dataStore } from "@/utils/store/zustand";
import { Orbit } from "lucide-react";
import { useEffect, useRef } from "react";

import { BACKEND_URL } from "@/utils/constants/api-endpoints";
import IssueCard from "@/components/issueCard/IsshueCard";

const CycleClient = ({ token, slug }: { token: string; slug: string }) => {
  const allIssues = dataStore((state) => state.fetchAllIssues);
  const issueStatus = dataStore((state) => state.cycleIssueStatus);
  const allLinearIssues = dataStore((state) => state.cycleAllLinearIssues);

  // Using useRef to avoid re-rendering
  const workSpaceRef = useRef<boolean>(false);

  useEffect(() => {
    const myWorkSpace = localStorage.getItem("workspace_slug") === slug;
    workSpaceRef.current = myWorkSpace;
    const url = token && myWorkSpace ? `${BACKEND_URL}/workspaces/${slug}/cycles/current/issues/`: `${BACKEND_URL}/public/${slug}/cycles/current/issues`;
    allIssues(token, url, "cycle");
  }, [token, slug]);

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

      <IssueCard
        token={token}
        issue={allLinearIssues}
        issueStatus={issueStatus}
        myWorkSpace={workSpaceRef.current} // Using ref value without causing re-render
      />
    </section>
  );
};

export default CycleClient;
