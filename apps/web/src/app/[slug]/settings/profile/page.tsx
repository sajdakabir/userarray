import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import ProfileClient from "@/views/settings/profile/Profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "profile settings for userarray",
};

const Profile = () => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  return <ProfileClient accessToken={accessToken} />;
};

export default Profile;
