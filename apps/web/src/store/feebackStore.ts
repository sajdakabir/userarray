import getAllFeedBack from '@/server/fetchers/feedback/getAllFeedback';
import { Feedback } from '@/types/Feedback';
import { create } from 'zustand';

interface UseIssueStore {
    isLoading: boolean;
    allFeedback: Feedback[];
    
    fetchAllFeedback: (token: string | null, url: string) => Promise<boolean>;
}

export const useFeedBackStore = create<UseIssueStore>((set) => ({
    isLoading: false,
    allFeedback:[],

    fetchAllFeedback: async (token, url) => {
        set({ isLoading: true });

        
        try {
            const allFeedback = await getAllFeedBack(token, url);
             
            if (allFeedback && allFeedback.length > 0) {
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
}));