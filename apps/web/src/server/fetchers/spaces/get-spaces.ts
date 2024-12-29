import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { AllSpaces } from "@/lib/types/Spaces";

export const getSpaces = async (accessToken: string, slug: string) => {
  let response: Response;

  try {
    response = await fetch(USER_WORKSPACE + `/${slug}/spaces`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    if (!response.ok) {
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }

  const spaces: AllSpaces = await response.json();
  return spaces;
};
