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
  

    // Await the cookies and set the cookies
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

    redirectUrl = "/workspace";
  } catch (error) {
    const e = error as AxiosError;
    console.error(e.message);
   
  }

  return redirect(redirectUrl);
}
