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
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;

  return (
    <ArchiveClient
      token={accessToken}
      slug={params.slug}
      space={params.space}
    />
  );
};

export default Archive;
