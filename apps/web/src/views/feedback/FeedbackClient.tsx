"use client";

import { FC, useState } from 'react';
import { ThumbsUp, MessageSquare, Plus } from 'lucide-react';
import CreateFeedbackModal from '@/components/modals/CreateFeedbackModal';

interface FeedbackClientProps {
  token?: string;
  slug?: string;
  workspace?: boolean | null;
}

const FeedbackClient: FC<FeedbackClientProps> = ({ token, slug, workspace }) => {
  const [activeStatus, setActiveStatus] = useState("open");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmitFeedback = (title: string, description: string, label: string) => {
    // TODO: Implement feedback submission with label
    console.log('Submitting feedback:', { title, description, label });
  };

  const feedbackStatus = [
    { id: "open", name: "Open" },
    { id: "inProgress", name: "In Progress" },
    { id: "closed", name: "Closed" }
  ];

  const mockFeedback = [
    {
      id: '1',
      title: 'Add dark mode support',
      description: 'Would be great to have a dark mode option for better visibility at night.',
      status: 'open',
      votes: 42,
      comments: 8,
    },
    {
      id: '2',
      title: 'Mobile app version',
      description: 'Please consider developing a mobile app for easier access on the go.',
      status: 'inProgress',
      votes: 35,
      comments: 12,
    },
    {
      id: '3',
      title: 'Keyboard shortcuts',
      description: 'Add keyboard shortcuts for common actions to improve productivity.',
      status: 'inProgress',
      votes: 28,
      comments: 5,
    },
    {
      id: '4',
      title: 'Export data feature',
      description: 'Need ability to export data in CSV format',
      status: 'closed',
      votes: 15,
      comments: 3,
    },
    {
      id: '5',
      title: 'Better search filters',
      description: 'Add more advanced search filters and sorting options',
      status: 'closed',
      votes: 22,
      comments: 7,
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      open: '#16A34A',
      inProgress: '#2563EB',
      closed: '#666666'
    };
    return colors[status.toLowerCase()] || '#666666';
  };

  const scrollToStatus = (statusId: string) => {
    const element = document.getElementById(`status-${statusId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveStatus(statusId);
  };

  return (
    <section className="h-screen flex flex-col flex-grow" style={{ backgroundColor: '#FFF' }}>
      <div className="flex-1 h-full overflow-auto">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-black">Feedback</h2>
            <button 
              className="flex items-center gap-2 px-3 py-1.5 text-[#666] border border-[#E3E3E3] rounded-lg hover:border-[#666] transition-colors text-sm"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} />
              New feedback
            </button>
          </div>
          
          <div className="flex gap-8">
            {/* Status List */}
            <div className="w-48 flex-shrink-0 pt-4" style={{ backgroundColor: '#FFF' }}>
              <div className="flex flex-col gap-2">
                {feedbackStatus.map((state) => (
                  <button
                    key={state.id}
                    onClick={() => scrollToStatus(state.id)}
                    className={`text-sm py-1.5 px-3 rounded-lg transition-colors relative text-left ${
                      activeStatus === state.id 
                        ? 'text-black font-medium'
                        : 'text-[#666] hover:text-black'
                    }`}
                  >
                    {activeStatus === state.id && (
                      <div 
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full"
                        style={{ backgroundColor: getStatusColor(state.name) }}
                      />
                    )}
                    {state.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto pr-4">
              <div className="flex flex-col pb-16">
                {feedbackStatus.map((state) => {
                  const statusFeedback = mockFeedback.filter(
                    (item) => item.status.toLowerCase() === state.id
                  );

                  return (
                    <div
                      key={state.id}
                      id={`status-${state.id}`}
                      data-status-section
                      data-status-id={state.id}
                      className="w-full group"
                    >
                      <div className="flex items-center gap-2 px-1 py-1.5 hover:bg-[#F8F8F8] rounded-lg mt-8 first:mt-0">
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-black font-medium text-sm">
                            {state.name}
                          </span>
                          <span className="text-xs text-[#666]">
                            {statusFeedback.length} {statusFeedback.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-2">
                        {statusFeedback.map((feedback) => (
                          <div
                            key={feedback.id}
                            className="px-3 py-1.5 hover:bg-[#F8F8F8] transition-colors duration-200 cursor-pointer rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="text-black text-sm truncate">{feedback.title}</p>
                                </div>

                                {feedback.description ? (
                                  <div className="text-xs text-[#666] block line-clamp-2">
                                    {feedback.description}
                                  </div>
                                ) : (
                                  <span className="text-xs text-[#666] block italic opacity-60">
                                    No description
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 shrink-0">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp size={14} className="text-[#666]" />
                                  <span className="text-xs text-[#666]">{feedback.votes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare size={14} className="text-[#666]" />
                                  <span className="text-xs text-[#666]">{feedback.comments}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreateFeedbackModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitFeedback}
      />
    </section>
  );
};

export default FeedbackClient;
