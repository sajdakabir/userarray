import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_TOKEN } from "@/utils/constants/cookie";
import type { Metadata } from "next";
import ItemClient from "@/views/item/ItemClient";

export const metadata: Metadata = {
  title: "Item",
  description: "Item managing page",
};

const Item = ({
  params,
}: {
  params: { space: string; slug: string; item: string };
}) => {
  const cookieStore = cookies();
  const token = cookieStore.get(ACCESS_TOKEN);
  const accessToken = token?.value;

  if (!cookieStore.has(ACCESS_TOKEN) || !accessToken) {
    return redirect("/");
  }

  return (
    <ItemClient token={accessToken} space={params.space} id={params.item} />
  );
};

export default Item;
