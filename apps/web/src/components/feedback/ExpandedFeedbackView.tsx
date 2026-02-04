"use client";

import { useState } from "react";
import { Feedback, FeedbackStatus } from "@/types/Feedback";
import {
  ChevronLeft,
  // Link2,
  ThumbsUp,
  MessageSquare,
  Plus,
  User,
} from "lucide-react";
// import Link from "next/link";
import CreateFeedbackModal from "../modals/CreateFeedbackModal";
import { WorkSpaceLabels } from "@/types/Users";
import { formatMongoDate } from "@/utils/helper";
import Image from "next/image";
import { labels } from "@/types/Issue";

const DEFAULT_STATUSES = [
  { name: "Open", color: "#16A34A" },
  { name: "In Progress", color: "#2563EB" },
  { name: "Closed", color: "#666666" },
];

interface ExpandedFeedbackViewProps {
  allFeedback: Feedback[];
  selectedFeedback: Feedback;
  onFeedbackSelect: (feedback: Feedback | null) => void;  
  workspaceLavels?: WorkSpaceLabels[];
  feedBackStatus?: FeedbackStatus[];
}

const ExpandedFeedbackView = ({
  allFeedback = [],
  selectedFeedback,
  onFeedbackSelect,
  workspaceLavels = [],
  feedBackStatus ,
}: ExpandedFeedbackViewProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState("Open");

  if (!selectedFeedback) return null;

  const getStatusColor = (status: string) => {
    const foundStatus = DEFAULT_STATUSES.find(
      (s) => s.name.toLowerCase() === status
    );
    return foundStatus?.color || "#666666";
  };
  
  const filteredFeedback =
    activeStatus === "all"
      ? allFeedback
      : allFeedback.filter(
          (f) => f.state.name.toLowerCase() === activeStatus.toLowerCase()
        );

  return (
    <div className="flex flex-col bg-white min-h-full h-auto">
      {/* Container with max width and padding */}
      <div className="w-full max-w-[1400px] mx-auto px-6">
        {/* Top header with back button and add feedback */}
        <div className="h-14 flex items-center justify-between">
          <button
            onClick={() => onFeedbackSelect(null)}
            className="flex items-center gap-2 text-[#344054] hover:text-[#101828] transition-colors text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to all feedback
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-[#344054] hover:text-[#101828] hover:bg-gray-50 rounded-lg transition-all text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add feedback
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar */}
          <div className="w-[280px] border-r border-[#EAECF0] flex flex-col">
            <div className="sticky top-0 z-10">
              {/* List header with status filters */}
              <div className="px-4 py-4 bg-white">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {feedBackStatus && feedBackStatus.map((status) => (
                    <button
                      key={status.name}
                      onClick={() => setActiveStatus(status.name)}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        activeStatus === status.name
                          ? "text-[#101828]"
                          : "text-[#475467] hover:text-[#101828]"
                      }`}
                      style={
                        activeStatus === status.name
                          ? {
                              backgroundColor: `${getStatusColor(status.name)} 15`,
                              color: `${getStatusColor(status.name)}`,
                            }
                          : {}
                      }
                    >
                      {status.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Feedback list */}
            <div className="flex-1 overflow-y-auto px-3 pt-2">
              {filteredFeedback.map((feedback) => (
                <div
                  key={feedback._id}
                  onClick={() => onFeedbackSelect(feedback)}
                  className={`cursor-pointer transition-colors rounded-lg mb-1 ${
                    selectedFeedback._id === feedback._id
                      ? "bg-[#F9FAFB]"
                      : "hover:bg-[#F9FAFB]"
                  }`}
                >
                  <div className="px-3 py-2.5">
                    <div className="flex flex-col gap-1.5">
                      {/* Status and ID */}
                      <div className="flex items-center justify-between gap-2">
                        <div
                          className="px-1.5 py-0.5 rounded-full text-[10px] font-medium"
                          style={{
                            backgroundColor: `${getStatusColor(feedback.state.name)}15`,
                            color: getStatusColor(feedback.state.name),
                          }}
                        >
                          {feedback.state.name}
                        </div>
                        <span className="text-[10px] font-medium text-[#475467] whitespace-nowrap">
                          HQ-{feedback.uuid?.slice(0, 2)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-sm font-medium leading-5 ${
                          feedback._id === selectedFeedback._id
                            ? "text-[#101828]"
                            : "text-[#344054]"
                        }`}
                      >
                        {feedback.title}
                      </h3>

                      {/* Description preview */}
                      {feedback.description && (
                        <p className="text-xs text-[#475467] line-clamp-2">
                          {feedback.description}
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="flex items-center justify-between text-[#475467]">
                        <span className="text-[10px]">
                          {formatMongoDate(feedback.createdAt)}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <ThumbsUp className="w-3 h-3" />
                            <span className="text-[10px]">
                              {feedback?.like || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MessageSquare className="w-3 h-3" />
                            <span className="text-[10px]">
                              {feedback?.comments || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main feedback view */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-2xl mx-auto px-6 py-6">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${getStatusColor(selectedFeedback.state.name)}15`,
                        color: getStatusColor(selectedFeedback.state.name),
                      }}
                    >
                      {selectedFeedback.state.name}
                    </div>
                    <span className="text-sm text-[#475467]">
                      HQ-{selectedFeedback.uuid?.slice(0, 2)}
                    </span>
                  </div>
                  <h1 className="text-2xl font-semibold text-[#101828] mb-3">
                    {selectedFeedback.title}
                  </h1>
                  <div className="flex items-center gap-2.5 text-sm text-[#475467]">
                    
                    <div className="flex items-center gap-2 ">
                      {" "}
                      <span>Created by </span>{" "}
                      {selectedFeedback.createdBy?.avatar ?(
                        <Image
                          src={selectedFeedback.createdBy.avatar}
                          alt={selectedFeedback?.createdBy?.firstName || "User"}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      ) : (
                        <User />
                      )}
                      {selectedFeedback.createdBy?.firstName}{" "}
                      <span> {formatMongoDate(selectedFeedback.createdAt) }  </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="prose prose-sm max-w-none mb-8 text-[#344054]">
                  {selectedFeedback.description ? (
                    <div className="whitespace-pre-wrap leading-relaxed">
                      {selectedFeedback.description}
                    </div>
                  ) : (
                    <p className="text-[#475467] italic">
                      No description provided
                    </p>
                  )}
                </div>

                {/* Labels */}
                {selectedFeedback.labels &&
                  selectedFeedback.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8">
                      {selectedFeedback.labels.map((label: labels) => (
                        <span
                          key={label.id}
                          className="px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${label.color}15`,
                            color: label.color,
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  )}

                {/* Activity */}
                <div className="pt-8 border-t border-[#EAECF0]">
                  <h2 className="text-lg font-semibold text-[#101828] mb-6">
                    Activity
                  </h2>
                  {/* <div className="space-y-5">
                    {selectedFeedback.activity?.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F9FAFB] flex items-center justify-center shrink-0">
                          {activity.type === "status_change" ? (
                            <div className="w-4 h-4 rounded-full bg-[#2E90FA]" />
                          ) : (
                            <Link2 className="w-4 h-4 text-[#475467]" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-[#344054]">
                            <span className="font-medium">{activity.user}</span>{" "}
                            {activity.type === "status_change"
                              ? `changed status from ${activity.from} to ${activity.to}`
                              : activity.action}
                          </p>
                          <span className="text-xs text-[#475467]">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div> */}
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
