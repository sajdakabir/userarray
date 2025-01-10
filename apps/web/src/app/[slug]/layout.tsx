import DataProvider from "@/providers/DataProvider";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import { redirect } from "next/navigation";
import { getAllWorkspaces } from "@/server/fetchers/workspace/get-workspace";
import Sidebar from "@/components/sidebar/Sidebar";

const SlugLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}) => {
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;
  return (
    <main className="h-screen flex-col gap-0 justify-between">
      <Sidebar accessToken={accessToken} />
      {children}
    </main>
  );
};

export default SlugLayout;
