import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;
  redirect(`/${slug}/feedback`);

};

export default Page;
