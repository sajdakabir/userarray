import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import Sidebar from "@/components/sidebar/Sidebar";

const SpaceLayout = ({ children }: { children: React.ReactNode }) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  return (
    <>
      {/* <Sidebar accessToken={accessToken}/> */}
      {/* <div className="h-screen w-[1px] bg-divider"></div> */}
      <div className="mt-3">

      {children}
      </div>
    </>
  );
};

export default SpaceLayout;
