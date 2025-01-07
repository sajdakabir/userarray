import { BACKEND_URL } from "@/utils/constants/api-endpoints";

const getLinearAllTeam = async (token:string,linearToken:string,slug: string,) => {
   

    try {
        const response = await fetch(`${BACKEND_URL}/${slug}`, {
            headers: {
                Authorization: `Bearer ${token}`, // Use accessToken here
                linearToken: linearToken, // Use the linearToken here
            },
        });

        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null;
        }

        const eve = await response.json();
        console.log("eve", eve);

        return eve.teams;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export default getLinearAllTeam;
