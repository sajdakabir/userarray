import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import Today from "@/views/workspace/current/Today";
import Sidebar from "@/components/sidebar/Sidebar";

export const metadata: Metadata = {
  title: "Today",
  description: "Workspace today page",
};

const Workspace = async ({ params }: { params: { slug: string } }) => {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;


  return (
    <>
      
     
      <Today accessToken={accessToken} slug={params.slug} />
    </>
  );
};

export default Workspace;
