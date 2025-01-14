import { USER_WORKSPACE } from "@/config/apiConfig";
import { Workspace } from "@/types/workspace";

export const getAllWorkspaces = async (accessToken: string) => {
  let response: Response;

  try {
    response = await fetch(USER_WORKSPACE, {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
     

    }

    );
    if (!response.ok) {
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }

  const allWorkspaces = await response.json();
  const workspaces: Workspace = allWorkspaces.response[0];
  return workspaces;
};
