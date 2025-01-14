import { Issue } from "@/types/Issue";

const getAllIssue = async (token: string | null, url: string): Promise<Issue[] | null> => {
    try {
        const response = await fetch(url, {
          
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: "GET",
            next:{
              revalidate:1000
            }
            
        });

        if (!response.ok) {
            console.error("Failed to fetch issues:", response.status, response.statusText);
            return null;
        }

        const data = await response.json();

        // Ensure issues exist and match the expected type
        if (!data.issues || !Array.isArray(data.issues)) {
            console.error("Invalid response format:", data);
            return null;
        }

        // Type assertion for safety
        const issues: Issue[] = data.issues;

        return issues;
    } catch (error) {
        console.error("Error fetching issues:", error);
        return null;
    }
};

export default getAllIssue;
