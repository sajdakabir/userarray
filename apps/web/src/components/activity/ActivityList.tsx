import { FC } from "react";
import { History, Loader2 } from "lucide-react";
import ActivityComponent from "./ActivityComponent";

type ActivityListProps = {
  length: number;
  children: React.ReactNode;
  fetching: boolean;
  comment: string;
  setComment: (comment: string) => void;
  handleKeyDown: (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => Promise<void>;
};

const ActivityList: FC<ActivityListProps> = ({
  length,
  children,
  fetching,
  comment,
  setComment,
  handleKeyDown,
}) => {
  return (
    <div className="flex-grow bg-dashboard absolute h-screen right-0 max-h-screen min-w-80 max-w-80 rounded-l-[10px] shadow-md shadow-black/50 border border-item-border p-3 pr-1 ml-8">
      <div className="flex h-full flex-col justify-between gap-y-2">
        <div className="flex items-center gap-x-4 text-focus-text-hover font-medium">
          <div className="flex items-center gap-x-2 text-sm">
            <History size={16} />
            Activities
          </div>
          <div className="text-xs text-nonfocus-text">
            {length > 0 ? (
              <div>{length} activities</div>
            ) : (
              <div>No activities</div>
            )}
          </div>
        </div>

        <div className="flex max-h-[calc(100vh-70px)] flex-col text-focus-text">
          <div className="h-[calc(100%-40px)] overflow-auto p-2 justify-end mb-4">
            <div className="relative bottom-0">
              {/* Vertical line */}
              <div className="absolute left-[14px] my-2 top-0 bottom-0 w-[2px] bg-sidebar-button-hover" />
              {fetching ? (
                <ActivityComponent
                  Icon={<Loader2 className="animate-spin" size={18} />}
                  ActivityString={
                    <div>
                      <span className="text-focus-text-hover w-fit hover:underline cursor-pointer">
                        march
                      </span>{" "}
                      is loading activities from server.
                    </div>
                  }
                  time="now"
                />
              ) : (
                <>
                  {length > 0 ? (
                    children
                  ) : (
                    <ActivityComponent
                      Icon={null}
                      ActivityString={
                        <div>
                          no activities yet. post a comment to get started.
                        </div>
                      }
                      time="now"
                    />
                  )}
                </>
              )}
            </div>
          </div>

          <input
            datatype="comment"
            className={`bg-sidebar-button-hover ml-2 mr-4 mb-[6px] w-auto border-divider text-xs 2xl:text-sm`}
            type="text"
            onKeyDown={handleKeyDown}
            disabled={fetching}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Leave a comment"
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityList;
