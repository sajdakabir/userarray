import { Feedback } from "@/types/Feedback";

const getAllFeedBack = async (token: string | null, url: string) => {

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

export default getAllFeedBack;
