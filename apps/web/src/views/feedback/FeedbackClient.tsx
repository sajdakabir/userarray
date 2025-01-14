"use client";

import { FC } from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackClientProps {
  token: string;
  workspace: boolean | null;
}

const FeedbackClient: FC<FeedbackClientProps> = () => {
  const mockFeedback = [
    {
      id: '1',
      title: 'Add dark mode support',
      description: 'Would be great to have a dark mode option for better visibility at night.',
      status: 'Under Review',
      votes: 42,
      comments: 8,
    },
    {
      id: '2',
      title: 'Mobile app version',
      description: 'Please consider developing a mobile app for easier access on the go.',
      status: 'Planned',
      votes: 35,
      comments: 12,
    },
    {
      id: '3',
      title: 'Keyboard shortcuts',
      description: 'Add keyboard shortcuts for common actions to improve productivity.',
      status: 'In Progress',
      votes: 28,
      comments: 5,
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Under Review': '#6366F1',
      'Planned': '#6B7280',
      'In Progress': '#16A34A',
    };
    return colors[status] || '#6B7280';
  };

  return (
    <section className="h-screen flex flex-col flex-grow" style={{ backgroundColor: '#171717' }}>
      <div className="flex-1 h-full">
        <div className="w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="grid gap-4">
            {mockFeedback.map((item) => (
              <div 
                key={item.id} 
                className="bg-[#1F1F1F] rounded-lg p-4 hover:bg-[#2A2A2A] transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Voting Section */}
                  <div className="flex flex-col items-center gap-1">
                    <button className="p-1 hover:bg-[#171717] rounded transition-colors">
                      <ThumbsUp size={16} className="text-nonfocus-text" />
                    </button>
                    <span className="text-focus-text-hover font-medium text-sm">
                      {item.votes}
                    </span>
                    <button className="p-1 hover:bg-[#171717] rounded transition-colors">
                      <ThumbsDown size={16} className="text-nonfocus-text" />
                    </button>
                  </div>

                  {/* Content Section */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-focus-text-hover font-medium">
                        {item.title}
                      </h3>
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ 
                          backgroundColor: `${getStatusColor(item.status)}20`,
                          color: getStatusColor(item.status)
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-nonfocus-text text-sm mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-nonfocus-text text-sm">
                        <MessageSquare size={14} />
                        <span>{item.comments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeedbackClient;
