'use client'

import { FC } from "react";
import { Issue } from "@/types/Issue";
import { truncateString } from "@/utils/truncateString";

type IssueCardContentProps = {
  item: Issue;
  statusColor: string;
};

const IssueCardContent: FC<IssueCardContentProps> = ({ item, statusColor }) => {
  const getLabelStyle = (color?: string) => {
    if (!color) {
      return {
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        color: '#6B7280'
      };
    }

    try {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      if (isNaN(r) || isNaN(g) || isNaN(b)) {
        throw new Error('Invalid color format');
      }

      return {
        backgroundColor: `rgba(${r}, ${g}, ${b}, 0.1)`,
        color: color
      };
    } catch (error) {
      return {
        backgroundColor: 'rgba(107, 114, 128, 0.1)',
        color: '#6B7280'
      };
    }
  };

  return (
    <div className="px-3 py-1.5 hover:bg-[#1F1F1F] transition-colors duration-200 cursor-pointer">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-focus-text-hover text-sm truncate">
              {item.title}
            </p>
            {item.priority && (
              <span 
                className="shrink-0 text-xs"
                style={{ color: statusColor }}
              >
                P{item.priority}
              </span>
            )}
          </div>
          {item?.description && item.description !== "<p></p>" ? (
            <span
              dangerouslySetInnerHTML={{
                __html: truncateString(item.description, 100),
              }}
              className="text-xs text-focus-text block line-clamp-2"
            />
          ) : (
            <span className="text-xs text-focus-text block italic opacity-60">
              No description
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {item.labels && item.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.labels.slice(0, 2).map((label) => (
                <span 
                  key={label.id}
                  className="text-xs px-1.5 py-0.5 rounded-full whitespace-nowrap"
                  style={getLabelStyle(label.color)}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
          <span className="text-xs text-nonfocus-text whitespace-nowrap">
            {item?.dueDate && new Date(item.dueDate).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IssueCardContent;
