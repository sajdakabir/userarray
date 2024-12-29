import { GET_USER } from "@/utils/constants/api-endpoints";
import { UserResponse } from "@/lib/types/Users";

export const getUser = async (accessToken: string) => {
  let user: UserResponse;

  try {
    const response = await fetch(GET_USER, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });

    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    user = data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }

  return user;
};
