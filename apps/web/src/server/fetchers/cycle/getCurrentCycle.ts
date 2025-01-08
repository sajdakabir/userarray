import { Cycle } from "@/lib/types/Cycle";
import { BACKEND_URL } from "@/utils/constants/api-endpoints";


export const getCurrentCycleData = async (teamId: string, token: string, workSpaceName: string) => {
    console.log(`${BACKEND_URL}/workspaces/${workSpaceName}/teams/${teamId}/cycles/current`);
    
    try {
        const response = await fetch(`${BACKEND_URL}/workspaces/${workSpaceName}/teams/${teamId}/cycles/current`,
            {
                headers: {
                    Authorization: "Bearer " + token,
                },
                method: 'GET',
                next:{
                    revalidate: 10
                }
            },
            
        );
        const data = await response.json();
        console.log("'response'",data);
        
        const currentCycle: Cycle = data.response;
        return currentCycle;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};