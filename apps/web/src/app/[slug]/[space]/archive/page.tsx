import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import type { Metadata } from "next";
import ArchiveClient from "@/views/space/archive/Archive";

export const metadata: Metadata = {
  title: "Archives",
  description: "Space archive items",
};

const Archive = ({ params }: { params: { space: string; slug: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  return (
    <ArchiveClient
      token={accessToken}
      slug={params.slug}
      space={params.space}
    />
  );
};

export default Archive;
