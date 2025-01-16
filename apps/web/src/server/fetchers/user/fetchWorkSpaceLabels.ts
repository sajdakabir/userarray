import { WorkSpaceLabels } from "@/types/Users";

export const getWorkspaceLabels = async (accessToken: string, url: string): Promise<WorkSpaceLabels[]> => {
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      method: 'GET',
    });

    if (!response.ok) {
      // Returning an empty array instead of null
      return [];
    }

    const data = await response.json();
    const workspaceLabels: WorkSpaceLabels[] = Array.isArray(data.response) ? data.response : []; // Ensuring it returns an array

    return workspaceLabels;
  } catch (error) {
    console.error("Error:", error);
    // Return an empty array on error instead of null
    return [];
  }
};
