import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Signin from "@/views/auth/Signin";
import { getUser } from "@/server/fetchers/user/getdetails";
import { User } from "@/types/Users";
import { ACCESS_TOKEN } from "@/config/constant/cookie";

const Home = async () => {
 const cookieStore = await cookies();
   const accessToken = cookieStore.get(ACCESS_TOKEN)?.value as string;
 
   const user: User | null = await getUser(accessToken);

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken || !user) {
    return <Signin />;
  }
  
  redirect("/onboarding");
  // if (user.hasFinishedOnboarding) {
  //   redirect(`/${workSpace.slug}/cycle`);
  // } else {
  //   redirect("/onboarding");
  // }
};

export default Home;
