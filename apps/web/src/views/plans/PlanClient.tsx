"use client";

// import { Orbit } from "lucide-react";
import { useEffect } from "react";

import IssueCard from "@/components/issueCard/IssueCard";
import { BACKEND_URL } from "@/config/apiConfig";
import { useIssueStore } from "@/store";

const PlanClient = ({
  token,
  slug,
  workspace,
}: {
  token: string;
  slug: string;
  workspace: null | boolean;
}) => {
  const { allLinearIssues, fetchAllIssues, issueStatus } = useIssueStore();

  useEffect(() => {
    const url =
      token && workspace
        ? `${BACKEND_URL}/workspaces/${slug}/issues/`
        : `${BACKEND_URL}/public/workspaces/${slug}/issues`;

    fetchAllIssues(token, url, "plan");
  }, [token, slug, fetchAllIssues]);

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
              issue={allLinearIssues}
              issueStatus={issueStatus}
              myWorkSpace={workspace}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanClient;
