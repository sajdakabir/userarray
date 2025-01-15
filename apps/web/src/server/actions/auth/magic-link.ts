"use server";

import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";
import { LoginResponse } from "@/types/Authentication";
import { BACKEND_URL } from "@/config/apiConfig";

const MAGIC_VERIFY = `${BACKEND_URL}/auth/magic/verify/`;

import {
  ACCESS_TOKEN,
  MAX_AGE,
  REFRESH_TOKEN,
} from "@/config/constant/cookie";

export const VerifyMagicLink = async (authToken: string) => {
  let res: LoginResponse;

  try {
    const response = await axios.post(MAGIC_VERIFY, { token: authToken });
    res = response.data;
  } catch (error) {
    const e = error as AxiosError;
    console.error(e.response?.data);
    return false;
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


  return true;
};
