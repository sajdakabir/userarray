import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import type { Metadata } from "next";
import Roadmap from "@/views/roadmap/Roadmap";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "roadmap for march spaces",
};

const Page = ({
  params,
}: {
  params: { space: string; slug: string; id: string };
}) => {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;


  const integerId = parseInt(params.id);
  if (isNaN(integerId)) {
    return redirect("/error?status=400&message=Invalid Roadmap ID");
  }

  return (
    <Roadmap
      slug={params.slug}
      space={params.space}
      token={accessToken}
      id={integerId}
    />
  );
};

export default Page;
