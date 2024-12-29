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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  let redirectUrl = "/";

  if (!code) {
    return redirect(redirectUrl);
  }

  try {
    const { data } = await axios.post(
      `${BACKEND_URL}/auth/google/login`,
      null,
      {
        headers: {
          "x-google-auth": `${code}`,
        },
      }
    );
    const res: LoginResponse = data;
    console.log(res);
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

    redirectUrl = "/workspace";
  } catch (error) {
    const e = error as AxiosError;
    console.error(e.message);
    console.log(e.response?.data);
  }

  return redirect(redirectUrl);
}
