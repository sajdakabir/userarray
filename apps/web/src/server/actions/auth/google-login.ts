"use server";

import { BACKEND_URL } from "@/config/apiConfig";
import {
  ACCESS_TOKEN,
  MAX_AGE,
  REFRESH_TOKEN,
} from "@/config/constant/cookie";
import { LoginResponse } from "@/types/Authentication";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LoginWithGoogle = async (token: string) => {
  try {
    
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

    return redirect("/");
  } catch (error) {
    const e = error as AxiosError;
    console.error(e.message);
    console.log(e.response?.data)
    return redirect("/");
  }
};

export default LoginWithGoogle;