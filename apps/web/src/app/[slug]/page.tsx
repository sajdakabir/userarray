import { redirect } from "next/navigation";

const User = () => {
  // TODO: Get the current slug, if available and redirect there. If not, go to '/'
  return redirect("/workspace");
};

export default User;
