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
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;


  return (
    <>
    {/* <PlanClient
      token={accessToken}
      slug={params.slug}
      space={params.space}
      /> */}
     
      </>
  );
};

export default Plans;
