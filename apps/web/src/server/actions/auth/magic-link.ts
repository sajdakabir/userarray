"use server";

import { cookies } from "next/headers";
import axios, { AxiosError } from "axios";
import { LoginResponse } from "@/lib/types/Authentication";
import { MAGIC_VERIFY } from "@/utils/constants/api-endpoints";
import {
  ACCESS_TOKEN,
  MAX_AGE,
  REFRESH_TOKEN,
} from "@/utils/constants/cookie";

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

  return true;
};
