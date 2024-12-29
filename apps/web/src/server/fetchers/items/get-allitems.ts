import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { AllItems } from "@/lib/types/Items";

export const getItems = async (accessToken: string, slug: string, space: string) => {
  let response: Response;
  try {
    response = await fetch(USER_WORKSPACE + `/${slug}/spaces/${space}/items`, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    if (!response.ok) {
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }

  const items: AllItems = await response.json();
  return items.response;
};
