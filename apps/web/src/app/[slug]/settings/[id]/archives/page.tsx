import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import Archives from "@/views/settings/space/Archives";

export const metadata: Metadata = {
  title: "Space Archives",
  description: "Archive of a space",
};

const page = ({ params }: { params: { id: string; slug: string } }) => {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;


  return (
    <Archives token={accessToken} spaceId={params.id} slug={params.slug} />
  );
};

export default page;
