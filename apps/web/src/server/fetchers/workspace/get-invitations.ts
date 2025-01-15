// import { GET_USER } from "@/utils/constants/api-endpoints";
// import { PendingInvitations } from "@/types/Workspaces";
// import axios from "axios";

// export const getPendingInvitations = async (accessToken: string) => {
//   let res: PendingInvitations;
//   try {
//     const { data } = await axios.get(`${GET_USER}/invitations/workspaces`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });
//     res = data;
//   } catch (error) {
//     res = {
//       status: 500,
//       response: [],
//     };
//   }
//   return res;
// };
