import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import WorkspaceClient from "@/views/settings/workspace/Workspace";
export const metadata: Metadata = {
  title: "Workspace",
  description: "Workspace settings for march",
};

const WorkspaceSettings = ({ params }: { params: { slug: string } }) => {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;

  return <WorkspaceClient accessToken={accessToken} slug={params.slug} />;
};

export default WorkspaceSettings;
