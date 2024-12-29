import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
import { UserWorkspaces, WorkspaceBySlug } from "@/lib/types/Workspaces";

export const getWorkspaceBySlug = async (accessToken: string, slug: string) => {
  let response: Response;

  try {
    response = await fetch(USER_WORKSPACE + `/${slug}`, {
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

  const workspace: WorkspaceBySlug = await response.json();
  return workspace;
};

export const getAllWorkspaces = async (accessToken: string) => {
  let response: Response;

  try {
    response = await fetch(USER_WORKSPACE, {
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

  const workspaces: UserWorkspaces = await response.json();
  return workspaces;
};
