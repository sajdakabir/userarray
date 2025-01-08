import { BACKEND_URL } from "@/utils/constants/api-endpoints";

const getLinearAllTeam = async (token:string,linearToken:string,slug: string,) => {
   

    try {
        const response = await fetch(`${BACKEND_URL}/${slug}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                linearToken: linearToken,
            },
        });

        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null;
        }

        const eve = await response.json();

        return eve.teams;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
};

export default getLinearAllTeam;
