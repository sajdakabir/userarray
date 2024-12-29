import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import MembersClient from "@/views/settings/workspace/Members";

export const metadata: Metadata = {
  title: "Workspace Members",
  description: "Workspace Member settings for march",
};

const WorkspaceMembers = async ({ params }: { params: { slug: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  return <MembersClient accessToken={accessToken} slug={params.slug} />;
};

export default WorkspaceMembers;
