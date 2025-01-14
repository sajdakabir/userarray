import { User } from '@/types/Users';
import { create } from 'zustand';

interface UserProfile {
    isLoading: boolean;
    myProfile: User | null;
    logout: () => void;
    fetchUser: (token: string) => Promise<boolean>;
}

export const useUserStore = create<UserProfile>((set) => ({
    myProfile: null,
    isLoading: false,
    logout: () => {
        set({ myProfile: null });
    
    },

    fetchUser: async (token: string) => {
        set({ isLoading: true });
        try {

            const response = await fetch('/api/user/profile', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user');
            }

            const data = await response.json();
            set({ myProfile: data });
            return true;
        } catch (error) {
            console.error('Error fetching user:', error);
            return false;
        } finally{
            set({ isLoading: false });
        }
    },
}));