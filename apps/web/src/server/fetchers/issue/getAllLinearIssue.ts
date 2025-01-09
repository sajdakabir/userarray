import { Issue } from "@/lib/types/Issue";

const getAllIssue = async (token: string, url: string) => {
   
  try {
   const response = await fetch(url, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    if (!response.ok) {
      console.log(response);
      
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
