import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import Sidebar from "@/components/sidebar/Sidebar";
import UpdatesClient from "@/views/workspace/current/Updates";

export const metadata: Metadata = {
  title: "Updates",
  description: "Updates page for workspace",
};

const Updates = async ({ params }: { params: { slug: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  return (
    <>
      <Sidebar accessToken={accessToken} />
      <UpdatesClient token={accessToken} slug={params.slug} />
    </>
  );
};

export default Updates;
