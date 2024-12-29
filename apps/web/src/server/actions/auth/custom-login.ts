"use server";

import { COMMON_LOGIN } from "@/utils/constants/api-endpoints";
import {
  ACCESS_TOKEN,
  MAX_AGE,
  REFRESH_TOKEN,
} from "@/utils/constants/cookie";
import { LoginResponse } from "@/lib/types/Authentication";
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

  cookies().set(ACCESS_TOKEN, res.response.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  cookies().set(REFRESH_TOKEN, res.response.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: MAX_AGE,
    path: "/",
  });

  redirect("/workspace");
};

export default CustomLogin;
