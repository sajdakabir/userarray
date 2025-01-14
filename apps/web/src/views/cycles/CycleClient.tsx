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
    <section 
      className="h-screen flex flex-col flex-grow" 
      style={{ backgroundColor: '#171717' }}
    >
      <div className="flex-1 h-full pt-4" style={{ backgroundColor: '#171717' }}>
        <IssueCard
          token={token}
          issue={cycleAllLinearIssues}
          issueStatus={cycleIssueStatus}
          myWorkSpace={workspace} 
        />
      </div>
    </section>
  );
};

export default CycleClient;
