"use client";

import { Orbit } from "lucide-react";
import { useEffect } from "react";

import IssueCard from "@/components/issueCard/IssueCard";
import { BACKEND_URL } from "@/config/apiConfig";
import { useIssueStore } from "@/store";

const CycleClient = ({ token, slug,workspace }: { token: string; slug: string,workspace:null |boolean }) => {
 

  const { fetchAllIssues,cycleIssueStatus,cycleAllLinearIssues } = useIssueStore()

  // Using useRef to avoid re-rendering

  useEffect(() => {
    
    const url = token && workspace ? `${BACKEND_URL}/workspaces/${slug}/cycles/current/issues/`: `${BACKEND_URL}/public/${slug}/cycles/current/issues`;
    fetchAllIssues(token, url, "cycle");
  }, [token, slug,workspace]);

  // if(isLoading) return <Spinner/>
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
        issue={cycleAllLinearIssues}
        issueStatus={cycleIssueStatus}
        myWorkSpace={workspace} 
      />
    </section>
  );
};

export default CycleClient;
