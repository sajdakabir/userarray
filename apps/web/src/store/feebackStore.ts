import { createFeedBack, getAllFeedBack } from '@/server/fetchers/feedback/getAllFeedback';
import { Feedback, FeedbackStatus } from '@/types/Feedback';
import { create } from 'zustand';

interface UseIssueStore {
    isLoading: boolean;
    allFeedback: Feedback[];
    feedBackStatus:FeedbackStatus[];
    fetchAllFeedback: (token: string | null, url: string) => Promise<boolean>;
    createFeedBack:(token: string | null, url: string,body:{title:string,description:string}) => Promise<boolean>;
}

export const useFeedBackStore = create<UseIssueStore>((set,get) => ({
    isLoading: false,
    allFeedback:[],
    feedBackStatus:[],
    fetchAllFeedback: async (token, url) => {
        set({ isLoading: true });

        
        try {
            const allFeedback = await getAllFeedBack(token, url);
               
             
            if (allFeedback && allFeedback.length > 0) {
                const feedBackStatus = Array.from(
                    new Map(allFeedback.map(({ state }:Feedback) => [state.name, state])).values()
                );
                
                set({ feedBackStatus }); 
                set({ allFeedback });  // Update the feedback state separately
                set({ isLoading: false });
                return true;
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            set({ isLoading: false });
        }
        return false;
    },
    createFeedBack:async (token, url,body) => {
        set({ isLoading: true });

        
        try {
            const createNewFeedBack = await createFeedBack(token, url,body);
            console.log('createNewFeedBack',createNewFeedBack);
            
            if (createNewFeedBack) {
                const {allFeedback}=get()
                const newFeedBack=[createNewFeedBack,...allFeedback]
                const feedBackStatus = Array.from(
                    new Map(newFeedBack.map(({ state }:Feedback) => [state.name, state])).values()
                );
                set({ feedBackStatus }); 
                set({ allFeedback:newFeedBack });  // Update the feedback state separately
                set({ isLoading: false });
                return true;
            }
        } catch (error) {
            console.error('Error fetching feedback:', error);
        } finally {
            set({ isLoading: false });
        }
        return false;
    },
}));