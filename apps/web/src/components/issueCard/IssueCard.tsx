"use client";
import React, { FC, useState, useEffect, useRef } from "react";
import { Issue, IssueStatus } from "@/types/Issue";
// import { CheckSquare, Plus } from "lucide-react";
import IssueCardContent from "./IssueCardContent";

interface IssueCardProps {
  issue: Issue[];
  issueStatus: IssueStatus[];
  token: string;
  myWorkSpace: boolean | null;
}

const IssueCard: FC<IssueCardProps> = ({ issue, issueStatus }) => {
  const [activeStatus, setActiveStatus] = useState<string>(
    issueStatus[0]?.id || ""
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
        if (!contentRef.current) return;

        const container = contentRef.current;
        const sections = container.querySelectorAll("[data-status-section]");

        let maxVisibleSection: Element | null = null;
        let maxVisibleHeight = 0;

        sections.forEach((section) => {
            const rect = (section as HTMLElement)?.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            if (!rect) return;

            const visibleTop = Math.max(rect.top, containerRect.top);
            const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            if (visibleHeight > maxVisibleHeight) {
                maxVisibleHeight = visibleHeight;
                maxVisibleSection = section;
            }
        });

        if (maxVisibleSection) {
            const sectionId = (maxVisibleSection as HTMLElement).getAttribute("data-status-id");
            setActiveStatus(sectionId || "");
        }
    };

    if (contentRef.current) {
        contentRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
        if (contentRef.current) {
            contentRef.current.removeEventListener("scroll", handleScroll);
        }
    };
}, []);

  

  const getStatusColor = (name: string) => {
    const statusColors: { [key: string]: string } = {
      "In Progress": "#6366F1",
      Todo: "#6B7280",
      Done: "#16A34A",
      Canceled: "#DC2626",
    };
    return statusColors[name] || "#6B7280";
  };

  const scrollToStatus = (statusId: string) => {
    setActiveStatus(statusId)
    const element = document.getElementById(`status-${statusId}`);
    if (element && contentRef.current) {
      const container = contentRef.current;
      const elementTop = element.offsetTop;
      const containerTop = container.offsetTop;

      container.scrollTo({
        top: elementTop - containerTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full h-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 flex gap-8">
      {/* Status List */}
      <div className="w-48 flex-shrink-0 pt-4" style={{ backgroundColor: "#FFF" }}>
        <div className="flex flex-col gap-2">
          {issueStatus.map((state) => (
            <button
              key={state.id}
              id={state.id}
              onClick={() => scrollToStatus(state.id)}
              className={`text-sm py-1.5 px-3 rounded-lg transition-colors relative text-left ${
                activeStatus === state.id
                  ? "text-black font-medium"
                  : "text-[#666] hover:text-black"
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

      {/* Main Content - Scrollable */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto h-[calc(100vh-2rem)] pr-4 relative"
        style={{ backgroundColor: "#FFF" }}
      >
        <div className="flex flex-col pb-16 min-h-full">
          {issueStatus &&
            issueStatus.length !== 0 &&
            issueStatus.map((state) => {
              const allTasks = issue.filter(
                (issue) => issue.state?.id === state.id
              );
              const textColor = getStatusColor(state.name);

              return (
                <div
                  key={state.id}
                  id={`status-${state.id}`}
                  data-status-section
                  data-status-id={state.id}
                  className="w-full group min-h-[200px]"
                >
                  <div className="flex items-center gap-2 px-1 py-1.5 hover:bg-[#F8F8F8] rounded-lg group-first:mt-0 mt-1">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-black font-medium text-sm">
                        {state.name}
                      </span>
                    </div>
                  </div>
                  {allTasks.length > 0 && (
                    <div className="space-y-[1px]">
                      {allTasks.map((task) => (
                        <IssueCardContent 
                          key={task.uuid || task._id} 
                          item={task} 
                          statusColor={textColor}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default IssueCard;
