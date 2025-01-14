import { Feedback } from "@/types/Feedback";

export  const getAllFeedBack = async (token: string | null, url: string) => {

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const feedback:Feedback[]=data.issues
        return feedback;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export const createFeedBack = async (
    token: string | null,
    url: string,
    body: object
) => {
    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            method: "POST",
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const feedback: Feedback = data.issue;
        return feedback;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};


