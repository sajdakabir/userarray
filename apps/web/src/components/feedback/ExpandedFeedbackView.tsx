'use client';

import { FC, useState } from 'react';
import { Feedback, FeedbackStatus } from '@/types/Feedback';
import { ChevronLeft, Link2, ThumbsUp, MessageSquare, User2, Plus } from 'lucide-react';
import CreateFeedbackModal from '../modals/CreateFeedbackModal';
import { WorkSpaceLabels } from '@/types/Users';

const DEFAULT_STATUSES: FeedbackStatus[] = [
  { name: 'Open', color: '#16A34A' },
  { name: 'In Progress', color: '#2563EB' },
  { name: 'Closed', color: '#666666' }
];

interface ExpandedFeedbackViewProps {
  allFeedback: Feedback[];
  selectedFeedback: Feedback;
  onFeedbackSelect: (feedback: Feedback | null) => void;
  workspaceLavels?: WorkSpaceLabels[];
  feedBackStatus?: FeedbackStatus[];
}

const ExpandedFeedbackView: FC<ExpandedFeedbackViewProps> = ({
  allFeedback = [],
  selectedFeedback,
  onFeedbackSelect,
  workspaceLavels = [],
  feedBackStatus = DEFAULT_STATUSES,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('Open');
  
  if (!selectedFeedback) return null;

  const getStatusColor = (status: string): string => {
    const foundStatus = feedBackStatus.find(s => s.name.toLowerCase() === status.toLowerCase());
    return foundStatus?.color || '#666666';
  };

  const filteredFeedback = activeStatus === 'all' 
    ? allFeedback 
    : allFeedback.filter(f => f.state.name.toLowerCase() === activeStatus.toLowerCase());

  const onLinkClick = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Container with max width and padding */}
      <div className="w-full max-w-[1400px] mx-auto px-6">
        {/* Top header with back button and add feedback */}
        <div className="h-14 flex items-center justify-between">
          <button
            onClick={() => onFeedbackSelect(null)}
            className="flex items-center gap-2 text-[#344054] hover:text-[#101828] transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Feedback
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-[#344054] hover:text-[#101828] transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Feedback
          </button>
        </div>

        {/* Main content */}
        <div className="flex gap-6 mt-6">
          {/* Left column */}
          <div className="w-[400px] shrink-0">
            <div className="bg-white rounded-lg border border-[#EAECF0] p-4 mb-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-[#101828]">All Feedback</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveStatus('all')}
                    className={`text-sm px-2.5 py-1 rounded-full ${
                      activeStatus === 'all'
                        ? 'bg-[#F9FAFB] text-[#344054]'
                        : 'text-[#475467] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    All
                  </button>
                  {feedBackStatus.map(status => (
                    <button
                      key={status.name}
                      onClick={() => setActiveStatus(status.name)}
                      className={`text-sm px-2.5 py-1 rounded-full ${
                        activeStatus === status.name
                          ? 'bg-[#F9FAFB] text-[#344054]'
                          : 'text-[#475467] hover:bg-[#F9FAFB]'
                      }`}
                    >
                      {status.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Feedback list */}
              <div className="space-y-3">
                {filteredFeedback.map(feedback => (
                  <div
                    key={feedback._id}
                    onClick={() => onFeedbackSelect(feedback)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFeedback._id === feedback._id
                        ? 'border-[#D0D5DD] bg-[#F9FAFB]'
                        : 'border-[#EAECF0] hover:border-[#D0D5DD]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-sm font-medium text-[#101828] line-clamp-2">
                        {feedback.title}
                      </h3>
                      <div
                        className="shrink-0 w-2 h-2 rounded-full mt-1.5"
                        style={{ backgroundColor: getStatusColor(feedback.state.name) }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[#475467]">
                      <span className="text-[10px]">
                        {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString() : ''}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{feedback.like || 0}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span className="text-[10px]">{feedback.comments || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex-1">
            <div className="bg-white rounded-lg border border-[#EAECF0] p-6">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-semibold text-[#101828] mb-1">
                    {selectedFeedback.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-[#475467]">
                    <div className="w-6 h-6 rounded-full bg-[#F2F4F7] flex items-center justify-center">
                      <User2 className="w-3.5 h-3.5 text-[#344054]" />
                    </div>
                    <span>Created by {selectedFeedback.createdBy} · {selectedFeedback.createdAt ? new Date(selectedFeedback.createdAt).toLocaleDateString() : ''}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    onClick={onLinkClick}
                    className="w-8 h-8 rounded-lg border border-[#EAECF0] flex items-center justify-center cursor-pointer hover:border-[#D0D5DD] transition-colors"
                  >
                    <Link2 className="w-4 h-4 text-[#344054]" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-[#475467]">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{selectedFeedback.like || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#475467]">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">{selectedFeedback.comments || 0}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-[#101828] mb-2">Description</h2>
                <p className="text-sm text-[#475467] whitespace-pre-wrap">
                  {selectedFeedback.description}
                </p>
              </div>

              {/* Activity */}
              <div>
                <h2 className="text-lg font-semibold text-[#101828] mb-6">Activity</h2>
                <div className="space-y-5">
                  {selectedFeedback.activity?.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#F9FAFB] flex items-center justify-center shrink-0">
                        {activity.type === 'status_change' ? (
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: getStatusColor(activity.to || '') }}
                          />
                        ) : (
                          <User2 className="w-4 h-4 text-[#344054]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-[#344054]">
                          <span className="font-medium">{activity.user}</span>{' '}
                          {activity.type === 'status_change'
                            ? `changed status from ${activity.from} to ${activity.to}`
                            : activity.action}
                        </p>
                        <span className="text-xs text-[#475467]">
                          {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString() : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Feedback Modal */}
        <CreateFeedbackModal
          LABELS={workspaceLavels}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => {}}
        />
      </div>
    </div>
  );
};

export default ExpandedFeedbackView;
