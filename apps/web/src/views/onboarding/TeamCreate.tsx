import React from "react";
import getLinearAllTeam from "@/server/fetchers/onboarding/getAllLinearTeams";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SelectTeam from "./SelectTeam";
import { LINEAR_TOKEN } from "@/config/constant/cookie";

type TeamCreateProps = {
  token: string; 
  workspace:string
};

const TeamCreate = async ({ token,workspace }: TeamCreateProps) => {
  const cookieStore =await cookies();
  const linear_Token = cookieStore.get(LINEAR_TOKEN);
  const linearToken = linear_Token?.value;
  if (!linearToken || linearToken === undefined) {
    return redirect("/");
  }
  // Fetch the teams using both tokens
  const response = await getLinearAllTeam(
    token,
    linearToken,
    "linear/getLinearTeams/"
  );

  return (
    <div>
      <SelectTeam token={token} response={response} workspace={workspace} />
    </div>
  );
};

export default TeamCreate;
