"use server";

import { BACKEND_URL } from "@/utils/constants/api-endpoints";
import { ACCESS_TOKEN, MAX_AGE, REFRESH_TOKEN } from "@/utils/constants/cookie";
import { LoginResponse } from "@/lib/types/Authentication";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LoginWithGoogle = async (token: string) => {
  try {
    console.log("Google Token:", token);

    const { data } = await axios.post<LoginResponse>(
      `${BACKEND_URL}/auth/google/login/`,
      null,
      {
        headers: {
          "x-google-auth": `${token}`,
        },
      }
    );

    const res: LoginResponse = data;

    // Set Access Token
    cookies().set(ACCESS_TOKEN, res.response.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Ensure secure in production
      sameSite: "lax",
      maxAge:  60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Set Refresh Token
    cookies().set(REFRESH_TOKEN, res.response.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "lax",
      maxAge:  60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    // Redirect based on user status
    // const redirectURL = res.isNewUser ? "/onboarding" : "/workspace";
    const redirectURL = "/workspace";
    return redirect(redirectURL);
  } catch (error) {
    const e = error as AxiosError;
    console.error("Error during Google login:", e.message);
    console.log("Error response:", e.response?.data);

    // Redirect to home page on error
    return redirect("/");
  }
};

export default LoginWithGoogle;
