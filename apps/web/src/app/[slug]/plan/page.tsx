import { ACCESS_TOKEN } from "@/config/constant/cookie";
import { getAllWorkspaces } from "@/server/fetchers/workspace/get-workspace";
import { Workspace } from "@/types/workspace";
import PlanClient from "@/views/plans/PlanClient";
import { cookies } from "next/headers";

const Page = async ({ params }: { params: { slug: string } }) => {
    const { slug } = await params;
 
    
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string;
  // Get the specific workspace based on the slug
  const workSpace: Workspace | null = await getAllWorkspaces(accessToken);

  // Initialize myWorkSpace as null | boolean
  let myWorkSpace: null | boolean = null;

  if (!workSpace) {
    myWorkSpace = null;
  } else if (workSpace?.slug === slug) {
    myWorkSpace = true;
  } else {
    myWorkSpace = false;
  }

  return (
    <>
      <PlanClient token={accessToken} slug={slug} workspace={myWorkSpace} />
    </>
  );
};

export default Page;
