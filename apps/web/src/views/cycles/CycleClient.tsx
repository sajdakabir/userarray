"use client";

import { FC, useEffect } from "react";
import { Orbit } from "lucide-react";

import IssueCard from "@/components/issueCard/IssueCard";
import { BACKEND_URL } from "@/config/apiConfig";
import { useIssueStore } from "@/store";

interface CycleClientProps {
  token: string;
  slug: string;
  workspace: boolean | null;
}

const CycleClient: FC<CycleClientProps> = ({ token, slug, workspace }) => {
  const { fetchAllIssues, cycleAllLinearIssues, cycleIssueStatus } = useIssueStore();

  useEffect(() => {
    const url = token && workspace 
      ? `${BACKEND_URL}/workspaces/${slug}/cycles/current/issues/`
      : `${BACKEND_URL}/public/workspaces/${slug}/cycles/current/issues`;
    fetchAllIssues(token, url, "cycle");
  }, [token, slug, workspace, fetchAllIssues]);

  return (
    <section 
      className="h-screen flex flex-col flex-grow relative" 
      style={{ backgroundColor: '#FFF' }}
    >
      <div className="flex-1 h-full overflow-auto" style={{ backgroundColor: '#FFF' }}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="space-y-2 pb-16">
            <IssueCard
              token={token}
              issue={cycleAllLinearIssues}
              issueStatus={cycleIssueStatus}
              myWorkSpace={workspace}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CycleClient;
