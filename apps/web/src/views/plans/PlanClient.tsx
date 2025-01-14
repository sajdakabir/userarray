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
  const { allLinearIssues, fetchAllIssues, issueStatus } =useIssueStore();


  useEffect(() => {
    const url =
      token && workspace
        ? `${BACKEND_URL}/workspaces/${slug}/issues/`
        : `${BACKEND_URL}/public/workspaces/${slug}/issues`;

    fetchAllIssues(token, url, "plan");
  }, [token, slug, fetchAllIssues]);

  // if (!isLoading) return <Spinner />;

  return (
    <section className="h-screen flex flex-col gap-y-12 flex-grow right-0 bg-dashboard pt-8">
      <div className="mx-20">
        <h2 className="text-xl flex items-center font-medium text-focus-text-hover">
          <Orbit className="mr-2" size={20} />
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
        myWorkSpace={workspace} // Using ref value without causing re-render
      />
    </section>
  );
};

export default PlanClient;
