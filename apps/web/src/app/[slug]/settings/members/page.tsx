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
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;


  return <MembersClient accessToken={accessToken} slug={params.slug} />;
};

export default WorkspaceMembers;
