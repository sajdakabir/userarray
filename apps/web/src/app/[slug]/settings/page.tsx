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
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  return <WorkspaceClient accessToken={accessToken} slug={params.slug} />;
};

export default WorkspaceSettings;
