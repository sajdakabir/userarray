// import { USER_WORKSPACE } from "@/utils/constants/api-endpoints";
// import { Everything } from "@/types/Everything";

// const getEverything = async (token: string, slug: string) => {
//   let response: Response;

//   try {
//     response = await fetch(USER_WORKSPACE + `/${slug}/ping`, {
//       headers: {
//         Authorization: "Bearer " + token,
//       },
//     });
//     if (!response.ok) {
//       return null;
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return null;
//   }

//   const eve: Everything = await response.json();
//   return eve;
// };

// export default getEverything;
