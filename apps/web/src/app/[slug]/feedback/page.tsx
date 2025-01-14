import { ACCESS_TOKEN } from "@/config/constant/cookie";
import { getAllWorkspaces } from "@/server/fetchers/workspace/get-workspace";
import { Workspace } from "@/types/workspace";
import FeedbackClient from "@/views/feedback/FeedbackClient";
import { cookies } from "next/headers";

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string;
  const workSpace: Workspace | null = await getAllWorkspaces(accessToken);

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
      token={accessToken}
      workspace={myWorkSpace}
    />
  );
};

export default Page;