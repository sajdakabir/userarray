import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import type { Metadata } from "next";
import PlanClient from "@/views/space/plans/PlanClient";
import CycleClient from "@/views/space/cycles/CycleClient";

export const metadata: Metadata = {
  title: "Cycle",
  description: "Current Cycle Issue",
};

const Cycle = ({ params }: { params: { space: string; slug: string } }) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;
  
  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }
  return (
    <CycleClient
      token={accessToken}
      slug={params.slug}
      space={params.space}
    />
  );
};

export default Cycle;