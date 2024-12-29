import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import ActiveClient from "@/views/active/ActiveClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SingleActive = ({
  params,
}: {
  params: { space: string; slug: string; id: string };
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  return (
    <ActiveClient token={accessToken} space={params.space} id={params.id} />
  );
};

export default SingleActive;
