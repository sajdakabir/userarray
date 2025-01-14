"use server";

import {
  ACCESS_TOKEN,
  COMMON_LOGIN,
  MAX_AGE,
  REFRESH_TOKEN,
} from "@/config/constant/cookie";
import { LoginResponse } from "@/types/Authentication";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const CustomLogin = async (email: string, password: string) => {
  let res: LoginResponse;

  try {
    const { data } = await axios.post(COMMON_LOGIN, {
      email: email,
      password: password,
    });
    res = data;
  } catch (error) {
    const e = error as AxiosError;
    console.log(e.response);
    return;
  }
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_TOKEN, res.response.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  cookieStore.set(REFRESH_TOKEN, res.response.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  redirect("/workspace");
};

export default CustomLogin;
