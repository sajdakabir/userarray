"use server";

import { BACKEND_URL } from "@/utils/constants/api-endpoints";
import {
  ACCESS_TOKEN,
  MAX_AGE,
  REFRESH_TOKEN,
} from "@/utils/constants/cookie";
import { LoginResponse } from "@/lib/types/Authentication";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LoginWithGoogle = async (token: string) => {
  try {
    console.log(token);
    const { data } = await axios.post(
      `${BACKEND_URL}/auth/google/login/`,
      null,
      {
        headers: {
          "x-google-auth": `${token}`,
        },
      }
    );

    const res: LoginResponse = data;
    cookies().set(ACCESS_TOKEN, res.response.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    cookies().set(REFRESH_TOKEN, res.response.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    return redirect("/workspace");
  } catch (error) {
    const e = error as AxiosError;
    console.error(e.message);
    console.log(e.response?.data)
    return redirect("/");
  }
};

export default LoginWithGoogle;