import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import type { Metadata } from "next";
import RoadmapClient from "@/views/space/roadmap/RoadmapClient";

export const metadata: Metadata = {
  title: "Roadmaps",
  description: "Space roadmap items",
};

const Roadmaps = ({ params }: { params: { space: string; slug: string } }) => {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;


  return (
    <RoadmapClient token={accessToken} slug={params.slug} space={params.space} />
  );
};

export default Roadmaps;
