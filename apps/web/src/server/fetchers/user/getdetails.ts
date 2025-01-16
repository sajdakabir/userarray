import { GET_USER } from "@/config/apiConfig";
import { UserProfile } from "@/types/Users";

export const getUser = async (accessToken: string): Promise<UserProfile | null> => {
  try {
    const response = await fetch(GET_USER, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      
    });
    

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    const user: UserProfile = data.response; 
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
