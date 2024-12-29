import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import type { Metadata } from "next";
import SpaceSettingClient from "@/views/settings/space/SpaceSettings";

export const metadata: Metadata = {
  title: "Space Settings",
  description: "Space settings for march",
};

const SpaceSettings = ({
  params,
}: {
  params: { id: string; slug: string };
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  return (
    <SpaceSettingClient
      id={params.id}
      accessToken={accessToken}
      slug={params.slug}
    />
  );
};

export default SpaceSettings;
