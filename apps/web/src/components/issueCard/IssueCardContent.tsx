'use client'

import { FC } from "react";
import { Issue } from "@/types/Issue";
import { truncateString } from "@/utils/truncateString";

type IssueCardContentProps = {
  item: Issue;
};

const IssueCardContent: FC<IssueCardContentProps> = ({ item }) => {
  return (
    <div>
      <div>
        <div
          draggable={true}
          className="group flex flex-row item w-64 text-focus-text gap-3 px-3 py-2"
        >
          <div className="grow active:scale-100 duration-0">
            <div className="text-left select-none">
              <p className="font-medium text-focus-text-hover text-hx">
                {item.title}
              </p>

              {/* Description Logic */}
              {item?.description && item.description !== "<p></p>" ? (
                <span
                  dangerouslySetInnerHTML={{
                    __html: truncateString(item.description, 22),
                  }}
                  className="text-hx text-focus-text"
                />
              ) : (
                <span className="text-hx text-focus-text line-through">
                  No description
                </span>
              )}

              <div className="mt-2 flex justify-between items-center text-focus-text">
                <div className="flex items-center gap-1 px-[6px] py-[2px] text-sm rounded-md opacity-70 group-hover:opacity-100 duration-300">
                  {/* Add any status or tags here */}
                </div>
                <span className="text-xs text-focus-text"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCardContent;
