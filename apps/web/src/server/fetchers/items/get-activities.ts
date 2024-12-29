import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { AllItems } from "@/lib/types/Items";

// {{API_HOST}}/workspaces/:workspace/spaces/:space/items/:item/history/?req.query=item-comment

export const getItemHistory = async (accessToken: string, slug: string, space: string, itemId: string) => {
  let response: Response;
  try {
    response = await fetch(USER_WORKSPACE + `/${slug}/spaces/${space}/items/${itemId}/history/`, {
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
