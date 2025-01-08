import { Issue } from "@/lib/types/Issue";
import { BACKEND_URL } from "@/utils/constants/api-endpoints";

const getAllIssue = async (token: string, slug: string) => {
   
  try {
   const response = await fetch(`${BACKEND_URL}/${slug}`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) {
      return null;
    }

    const eve = await response.json();
    
    
    const issues:Issue[]=eve.issues;
    return issues;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }

 
};

export default getAllIssue;
