import React, { FC, useEffect, useState } from "react";
import getLinearAllTeam from "@/server/fetchers/onboarding/getAllLinearTeams";
import { cookies } from "next/headers";
import { LINEAR_TOKEN } from "@/utils/constants/cookie";
import { redirect } from "next/navigation";
import SelectTeam from "./SelectTeam";

type TeamCreateProps = {
  token: string; // Token passed as a prop
};

const TeamCreate: FC<TeamCreateProps> = async ({ token }) => {
  const cookieStore = cookies();
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
      <SelectTeam token={token} response={response} />
    </div>
  );
};

export default TeamCreate;
