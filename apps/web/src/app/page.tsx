import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { UserResponse } from "@/lib/types/Users";
import Signin from "@/views/auth/Signin";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import { getUser } from "@/server/fetchers/user/getdetails";

const Home = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return <Signin />;
  }

  const user: UserResponse | null = await getUser(accessToken);

  if(!user) {
    return <Signin />;
  }

  if (user.response.hasFinishedOnboarding) {
    redirect("/workspace");
  } else {
    redirect("/onboarding");
  }
};

export default Home;
