// import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
// import { WorkspaceMembers } from "@/types/Workspaces";

// export const getMembers = async (accessToken: string, slug: string) => {
//   let response: Response;

//   try {
//     response = await fetch(USER_WORKSPACE + `/${slug}/members`, {
//       headers: {
//         Authorization: "Bearer " + accessToken,
//       },
//     });
//     if (!response.ok) {
//       return null;
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return null;
//   }

//   const members: WorkspaceMembers = await response.json();
//   return members;
// };
