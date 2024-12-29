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
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

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
