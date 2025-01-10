import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import LabelSettingComponent from "@/views/settings/space/LabelSettings";

export const metadata: Metadata = {
  title: "Labels Settings",
  description: "Space labels settings for march",
};

const SpaceLabels = ({
  params,
}: {
  params: { id: string; slug: string };
}) => {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;


  return (
    <LabelSettingComponent
      id={params.id}
      accessToken={accessToken}
      slug={params.slug}
    />
  );
};

export default SpaceLabels;
