// FeedbackItem.tsx
import { Feedback } from '@/types/Feedback';
import React from 'react';

interface FeedbackItemProps {
    feedback: Feedback;
    token:string|null;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({feedback }) => {
    return (
        <div className="p-4 border border-gray-700 rounded-lg mb-4 bg-zinc-700">
            <h3 className="font-bold">{feedback.title}</h3>
            <p className="text-gray-400">{feedback.description}</p>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                
            </div>
        </div>
    );
};

export default FeedbackItem;
