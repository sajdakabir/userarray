import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import CreateProfile from "@/views/onboarding/CreateProfile";
import InviteMembers from "@/views/onboarding/InviteMembers";
import { UserWorkspaces } from "@/lib/types/Workspaces";
import { UserResponse } from "@/lib/types/Users";
import { getUser } from "@/server/fetchers/user/getdetails";
import { getAllWorkspaces } from "@/server/fetchers/workspace/get-workspace";
import { getPendingInvitations } from "@/server/fetchers/workspace/get-invitations";
import ManageWorkspace from "@/views/onboarding/ManageWorkspace";

export const metadata: Metadata = {
  title: "onboarding",
  description: "Creating Workspace for march",
};

const Onboard = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  const user: UserResponse | null = await getUser(accessToken);
  const workspaces: UserWorkspaces | null = await getAllWorkspaces(accessToken);

  if (!user || !workspaces) {
    return redirect("/error?status=500");
  }

  // If the user has already finished onboarding, redirect
  if (user.response.hasFinishedOnboarding) {
    return redirect("/workspace");
  }

  // Check the user progress

  if (!user.response.onboarding.profile_complete)
    return <CreateProfile accessToken={accessToken} />;
  else if (!user.response.onboarding.workspace_create) {
    const pending = await getPendingInvitations(accessToken);
    return (
      <ManageWorkspace token={accessToken} invitations={pending.response} />
    );
  } else if (!user.response.onboarding.workspace_invite)
    return <InviteMembers accessToken={accessToken} workSpaces={workspaces} />;
  // Add a workspace_join check and component
  else return redirect("/workspace");
};

export default Onboard;
