import getAllIssue from '@/server/fetchers/issue/getAllLinearIssue';
import { Issue,IssueStatus} from '@/types/Issue';
import { create } from 'zustand';

interface UseIssueStore {
    isLoading: boolean;
    issueStatus: IssueStatus[];
    allLinearIssues: Issue[];
    cycleIssueStatus: IssueStatus[];
    cycleAllLinearIssues: Issue[];
    fetchAllIssues: (token: string, url: string, type: 'plan' | 'cycle') => Promise<boolean>;
}

export const useIssueStore = create<UseIssueStore>((set) => ({
    isLoading: false,
    issueStatus: [],
    allLinearIssues: [],
    cycleIssueStatus: [],
    cycleAllLinearIssues: [],

    fetchAllIssues: async (token, url, type) => {
        
        set({ isLoading: true });
       

        try {
          
            const allIssues = await getAllIssue(token, url);

            if (allIssues && allIssues.length > 0) {
                const uniqueIssueStatuses = Array.from(
                    new Map(allIssues.map(({ state }:Issue) => [state.id, state])).values()
                );

                if (type === 'plan') {
                    set({ issueStatus: uniqueIssueStatuses, allLinearIssues: allIssues });
                } else if (type === 'cycle') {
                    set({ cycleIssueStatus: uniqueIssueStatuses, cycleAllLinearIssues: allIssues });
                }
                return true;
            }
        } catch (error) {
            console.error('Error fetching issues:', error);
        } finally {
            set({ isLoading: false });
        }
        return false;
    },
}));
