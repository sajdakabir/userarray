
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import PlanClient from "@/views/space/plans/PlanClient";

const Page = async ({ params }: { params: { slug: string } }) => {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;
  return (
    <>
      <PlanClient
      token={accessToken}
      slug={params.slug}
      />
    </>
  );
};

export default Page;
