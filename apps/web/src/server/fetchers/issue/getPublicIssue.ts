import { Issue } from "@/lib/types/Issue";

const getPublicIssue = async (url: string): Promise<Issue[] | null> => {
    console.log("url",url)
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            next: {
                revalidate: 1000, // 1000 seconds for ISR (Incremental Static Regeneration)
            },
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
