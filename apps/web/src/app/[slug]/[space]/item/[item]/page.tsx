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
  const accessToken = cookies().get(ACCESS_TOKEN)?.value as string;

  return (
    <ItemClient token={accessToken} space={params.space} id={params.item} />
  );
};

export default Item;
