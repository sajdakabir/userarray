import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import axios, { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const invitationId = searchParams.get("invitationId");

  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;


  let redirectUrl = `/error?status=403&message=Invalid+invitation+link`;


  if (!slug || !invitationId) {
    return redirect(redirectUrl);
  }

  try {
    const { data } = await axios.post(
      USER_WORKSPACE + `/${slug}/invitations/${invitationId}/join`,
      null,
      {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      }
    );
    console.log(data);
    redirectUrl = `/${slug}/today`;
  } catch (error) {
    const e = error as AxiosError;
    console.error(e.response?.data);
  }

  return redirect(redirectUrl);
}
