import { StateTeam } from "@/lib/types/Teams";
import { BACKEND_URL } from "@/utils/constants/api-endpoints";

const getMyTeams = async (token: string, slug: string) => {
    console.log("this get myTeams called");
    
  try {
   const response = await fetch(`${BACKEND_URL}/${slug}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) {
      return null;
    }

    const eve = await response.json();
    console.log("eve",eve);
    
    const teamData:StateTeam[]=eve.response;
    return teamData;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }

 
};

export default getMyTeams;
