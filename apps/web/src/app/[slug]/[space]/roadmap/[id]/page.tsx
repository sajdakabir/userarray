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
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

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
