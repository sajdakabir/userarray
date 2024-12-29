import { CycleActivityResponse } from "@/lib/types/Activity";
import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";

export const getCycleActivities = async (
  token: string,
  slug: string,
  space: string,
  cycleId: string
) => {
  let response: Response;
  try {
    response = await fetch(
      USER_WORKSPACE + `/${slug}/spaces/${space}/cycles/${cycleId}/history`,
      {
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    if (!response.ok) {
      return [];
    }
  } catch (error) {
    console.error("Error:", error);
    return [];
  }

  const history = await response.json() as CycleActivityResponse;
  return history.response;
};
