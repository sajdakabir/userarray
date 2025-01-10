import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import WorkspaceFinder from "@/views/workspace/WorkspaceFinder";
import { getUser } from "@/server/fetchers/user/getdetails";
import { UserResponse } from "@/lib/types/Users";

export const metadata: Metadata = {
  title: "March | Workspace",
  description: "Workspace dashboard page",
};

const Workspace = async () => {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;

  
  const user: UserResponse | null = await getUser(accessToken);
  
  
  if (!user) {
    return redirect("/error?status=500");
  }
  // If the user has not finished onboarding, redirect
  else if (!user.response.hasFinishedOnboarding) {
    return redirect("/onboarding");
  }
  
  return <WorkspaceFinder accessToken={accessToken} user={user.response} />;
};

export default Workspace;
