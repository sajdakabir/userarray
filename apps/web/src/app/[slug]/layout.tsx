import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/config/constant/cookie";
import { Workspace } from "@/types/workspace";
import { getAllWorkspaces } from "@/server/fetchers/workspace/get-workspace";
import { getUser } from "@/server/fetchers/user/getdetails";
import { User } from "@/types/Users";
import Header from "@/components/header/Header";

const SlugLayout = async ({
  children,
}: {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string;
  const user: User | null = await getUser(accessToken);
  
 
  const workSpace: Workspace | null = await getAllWorkspaces(accessToken);

  

  return (
    <main className="h-screen flex-col gap-0 justify-between">
      <Header user={user} workSpace={workSpace} />
      {children}
    </main>
  );
};

export default SlugLayout;
