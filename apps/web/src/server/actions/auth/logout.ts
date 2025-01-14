"use server";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/config/constant/cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LogOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN);
  cookieStore.delete(REFRESH_TOKEN);
  redirect("/");
};

export default LogOut;
