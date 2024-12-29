import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import type { Metadata } from "next";
import PlanClient from "@/views/space/plans/PlanClient";

export const metadata: Metadata = {
  title: "Plans",
  description: "Space plan items",
};

const Plans = ({ params }: { params: { space: string; slug: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  return (
    <PlanClient
      token={accessToken}
      slug={params.slug}
      space={params.space}
    />
  );
};

export default Plans;
