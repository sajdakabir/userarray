import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import Inbox from "@/views/workspace/current/Inbox";
import Sidebar from "@/components/sidebar/Sidebar";

export const metadata: Metadata = {
  title: "Inbox",
  description: "Workspace inbox page",
};

const Workspace = async ({ params }: { params: { slug: string } }) => {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;


  return (
    <>
      <Sidebar accessToken={accessToken} />
      <div className="h-screen w-[1px] bg-divider" />
      <Inbox accessToken={accessToken} slug={params.slug} />
    </>
  );
};

export default Workspace;
