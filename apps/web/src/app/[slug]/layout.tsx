import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/config/constant/cookie";
// import { Workspace } from "@/types/workspace";
// import { getAllWorkspaces } from "@/server/fetchers/workspace/get-workspace";
import { getUser } from "@/server/fetchers/user/getdetails";
import TopBar from "@/components/topbar/TopBar";
import {  UserProfile } from "@/types/Users";

const SlugLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;

  params: Promise<{ slug: string }>
}) => {
  const {slug}=await params
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string;
  const user: UserProfile | null = await getUser(accessToken);
  // const workSpace: Workspace | null = await getAllWorkspaces(accessToken);

  return (
    <main className="h-screen flex-col gap-0 justify-between">
      <TopBar workspace={slug} myProfile={user}   />
      {children}
    </main>
  );
};

export default SlugLayout;
