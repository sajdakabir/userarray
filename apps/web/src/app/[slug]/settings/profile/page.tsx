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
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;


  return <ProfileClient accessToken={accessToken} />;
};

export default Profile;
