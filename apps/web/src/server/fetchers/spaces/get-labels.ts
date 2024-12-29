import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { AllLabels } from "@/lib/types/Labels";

export const getLabels = async (
  accessToken: string,
  slug: string,
  space: string
) => {
  let response: Response;
  try {
    response = await fetch(USER_WORKSPACE + `/${slug}/spaces/${space}/labels`, {
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

  const spaces: AllLabels = await response.json();
  return spaces;
};
