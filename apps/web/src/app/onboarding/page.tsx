import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import CreateProfile from "@/views/onboarding/CreateProfile";
import { User } from "@/types/Users";
import { getUser } from "@/server/fetchers/user/getdetails";
import LinearConnect from "@/views/onboarding/LinearConnect";
import { ACCESS_TOKEN } from "@/config/constant/cookie";
import CreateWorkspace from "@/views/onboarding/CreateWorkspace";
import { getAllWorkspaces } from "@/server/fetchers/workspace/get-workspace";
import { Workspace } from "@/types/workspace";
import Signin from "@/views/auth/Signin";
import TeamCreate from "@/views/onboarding/TeamCreate";

export const metadata: Metadata = {
  title: "onboarding",
  description: "Creating Workspace for march",
};

const Onboard = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string;

  const user: User | null = await getUser(accessToken);
  
  if (!user) {
    return <Signin />;
  }

  if (!user.onboarding?.profile_complete) {
    return <CreateProfile accessToken={accessToken} />;
  }

  if (!user.onboarding?.workspace_create) {
    return <CreateWorkspace accessToken={accessToken} />;
  }

  // If workspace creation is already done, fetch workspaces
  const workSpace: Workspace |null = await getAllWorkspaces(accessToken);
 
  
  if (workSpace===null) {
    return <CreateWorkspace accessToken={accessToken} />;
  }
  
  if (user.onboarding.linear_connect===false) {
    return <LinearConnect token={accessToken} />;
  }
  if (user.onboarding.team_create===false) {
      
    return (
      <TeamCreate token={accessToken} workspace={workSpace?.slug} />
    );
  }

  return redirect(`/${workSpace.slug}/feedback`);
};


export default Onboard;
