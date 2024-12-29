"use server";

import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/utils/constants/cookie";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LogOut = async () => {
  cookies().delete(ACCESS_TOKEN);
  cookies().delete(REFRESH_TOKEN);
  redirect("/");
};

export default LogOut;
