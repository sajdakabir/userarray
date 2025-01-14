// FeedbackItem.tsx
import React from 'react';

interface FeedbackItemProps {
    title: string;
    description: string;
    user: string;
    time: string;
    votes: number;
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ title, description, user, time, votes }) => {
    return (
        <div className="p-4 border border-gray-700 rounded-lg mb-4 bg-zinc-700">
            <h3 className="font-bold">{title}</h3>
            <p className="text-gray-400">{description}</p>
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                <span>{user} - {time}</span>
                <span>❤️ {votes}</span>
            </div>
        </div>
    );
};

export default FeedbackItem;
