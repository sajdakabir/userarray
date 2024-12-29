import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { MyItemsResponse } from "@/lib/types/Items";

export const getMyItems = async (accessToken: string, slug: string) => {
  let response: Response;
  const empty = {
    inbox: [],
    today: {
      current: [],
      overdue: [],
    },
  };
  const URL = USER_WORKSPACE + `/${slug}/my`;
  try {
    response = await fetch(URL, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    if (!response.ok) {
      return empty;
    }
  } catch (error) {
    console.error("Error:", error);
    return empty;
  }
  const items: MyItemsResponse = await response.json();
  return items.response;
};
