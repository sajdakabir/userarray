import CycleClient from "@/views/space/cycles/CycleClient";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import { cookies } from "next/headers";

const Page = async ({ params }: { params: { slug: string } }) => {
   const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;
 
  return (
    <>
      <CycleClient
      token={accessToken}
      slug={params.slug}
      />
    </>
  );
};

export default Page;
