import { GET_USER } from "@/config/apiConfig";
import { User } from "@/types/Users";

export const getUser = async (accessToken: string): Promise<User | null> => {
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
    console.log("data",data);
    
    const user: User = data.response; 
    return user;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};
