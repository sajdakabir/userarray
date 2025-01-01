import axios from "axios"
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"

import { BACKEND_URL, FRONTEND_URL } from "@/utils/constants/api-endpoints";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const redirectDomain = FRONTEND_URL

  if (!code) {
    console.error("No code received from Linear")
    return NextResponse.redirect(
      new URL("/login?error=no_code", redirectDomain)
    )
  }

  const cookieStore = cookies();
  const token = cookieStore.get("marchAccess");
  const accessToken = token?.value;


  try {
    const response = await axios.get(
      `${BACKEND_URL}/linear/getAccessToken`,
      {
        params: { code },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
// console.log("hmm linear response: ", response)
    const res = NextResponse.redirect(new URL("/workspace", redirectDomain))

    return res
    // return NextResponse.json({ message: "success" })
  } catch (error) {
    console.error("Error in Linear callback:", error)
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data)
    }
    return NextResponse.redirect(
      new URL("/login?error=linear_authentication_failed", redirectDomain)
    )
  }
}
