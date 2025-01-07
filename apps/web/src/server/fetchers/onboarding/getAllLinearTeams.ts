import { BACKEND_URL } from "@/utils/constants/api-endpoints";
import { Everything } from "@/lib/types/Everything";

const getLinearAllTeam = async (token: string, slug: string) => {
  let response: Response;

  try {
    response = await fetch( `${BACKEND_URL}/${slug}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) {
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }

  const eve = await response.json();
  console.log("eve",eve);
  
  return eve.teams;
};

export default getLinearAllTeam;