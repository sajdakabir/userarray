import IssueCard from "@/components/issueCard/IsshueCard";
import { Issue, IssueStatus } from "@/lib/types/Issue";
import getAllIssue from "@/server/fetchers/issue/getAllLinearIssue";
import React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import { BACKEND_URL } from "@/utils/constants/api-endpoints";
import getPublicIssue from "@/server/fetchers/issue/getPublicIssue";
// Dynamic SSG Page Component
const Page = async ({ params }: { params: { slug: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  // Fetch issues with null handling
  const all_issues = await getPublicIssue(
    `${BACKEND_URL}/public/workspaces/${params.slug}/issues/`
  );

  if (!all_issues) return redirect("/error?status=500");
  // Extract unique issue statuses safely
  const uniqueIssueStatuses: IssueStatus[] = Array.from(
    new Map(all_issues.map(({ state }) => [state.id, state])).values()
  );

  return (
    <div>
      <h1>All Issues for {params.slug}</h1>

      <IssueCard
        issue={all_issues}
        token={accessToken}
        issueStatus={uniqueIssueStatuses}
      />
    </div>
  );
};

export default Page;
