import { BACKEND_URL } from "@/config/apiConfig";
import { ACCESS_TOKEN } from "@/config/constant/cookie";
import { getWorkspaceLabels } from "@/server/fetchers/user/fetchWorkSpaceLabels";
import { getAllWorkspaces } from "@/server/fetchers/workspace/get-workspace";
import { WorkSpaceLabels } from "@/types/Users";
import { Workspace } from "@/types/workspace";
import FeedbackClient from "@/views/feedback/FeedbackClient";
import { cookies } from "next/headers";

const Page = async ({ params }: {params: Promise<{ slug: string }>}) => {
  const { slug } = await params;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string;

  // Get the specific workspace based on the slug
  const workSpace: Workspace | null = await getAllWorkspaces(accessToken);
  const workspaceLavels:WorkSpaceLabels[]  =await getWorkspaceLabels(accessToken,`${BACKEND_URL}/public/workspaces/${slug}/labels/`)
   
  let myWorkSpace: null | boolean = null;

  if (!workSpace) {
    myWorkSpace = null;
  } else if (workSpace?.slug === slug) {
    myWorkSpace = true;
  } else {
    myWorkSpace = false;
  }

  return (
    <FeedbackClient
      workspaceLavels={workspaceLavels}
      token={accessToken}
      slug={slug}
      workspace={myWorkSpace}
    />
  );
};

export default Page;
