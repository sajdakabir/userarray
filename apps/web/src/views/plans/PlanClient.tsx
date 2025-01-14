"use client";

import { Orbit } from "lucide-react";
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

  // if (!isLoading) return <Spinner />;

  return (
    <section className="h-screen flex flex-col flex-grow" style={{ backgroundColor: '#171717' }}>
      <div className="flex-1 overflow-auto">
        <IssueCard
          token={token}
          issue={allLinearIssues}
          issueStatus={issueStatus}
          myWorkSpace={workspace}
        />
      </div>
    </section>
  );
};

export default PlanClient;
