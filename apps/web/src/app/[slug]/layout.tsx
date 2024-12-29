import DataProvider from "@/providers/DataProvider";
import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import { redirect } from "next/navigation";
import { getAllWorkspaces } from "@/server/fetchers/workspace/get-workspace";

const SlugLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  const workspaces = await getAllWorkspaces(accessToken);
  if (!workspaces) {
    // cookie expired or server error
    return redirect("/error?status=500");
  }

  // check if the slug is valid
  let found = workspaces.response.findIndex(
    (workspace) => workspace.slug === params.slug
  );

  if (found === -1) {
    return redirect(`/${workspaces.response[0].slug}/today`);
  }

  return (
    <main className="h-screen flex gap-0 justify-between">
      <DataProvider
        slug={params.slug}
        token={accessToken}
        workspces={workspaces.response}
        thisWorkspace={found}
      >
        {children}
      </DataProvider>
    </main>
  );
};

export default SlugLayout;
