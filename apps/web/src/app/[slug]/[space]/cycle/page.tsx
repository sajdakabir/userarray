import { cookies } from "next/headers";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import { getCurrentCycleData } from "@/server/fetchers/cycle/getCurrentCycle";
import { Orbit } from "lucide-react";

import { redirect } from "next/navigation";
import CycleClient from "@/views/space/cycles/CycleClient";
type PageParams = {
    params: {
      space: string;
      slug:string
    };
  };
const Page: React.FC<PageParams> = async ({ params }) => {
  const { slug,space } = await params
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;
  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }
  
  const currentCycle = await getCurrentCycleData(
    space,
    accessToken,
    slug
  );

 
  

  return (
    <div className= "text-green-400">
     <div className="mx-20 flex gap-2">
        <h2 className="text-xl flex items-center font-medium text-focus-text-hover">
          <Orbit className="mr-2" size={20} />
          {currentCycle && currentCycle?.name}
        </h2>
        <h4 className="text-focus-text text-sm mt-2 flex items-center">
          All your work items: your playground from where you push things to be
          executed.
        </h4>
      </div>

        <CycleClient token={accessToken} slug={slug}  space={space} />

    </div>
  );
};

export default Page;
