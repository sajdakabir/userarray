import { Issue } from "@/types/Issue";

const getPublicIssue = async (url: string): Promise<Issue[] | null> => {

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-cache",
        });

        if (!response.ok) {
            console.error("Failed to fetch issues:", response.status, response.statusText);
            return null;
        }

        const data = await response.json();
        
        if (!data.issues || !Array.isArray(data.issues)) {
            console.error("Invalid response format:", data);
            return null;
        }

        // Explicitly casting the data to Issue[]
        return data.issues as Issue[];
    } catch (error) {
        console.error("Error fetching issues:", error);
        return null;
    }
};

export default getPublicIssue;
