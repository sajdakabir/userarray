import React from "react";

type ActivityComponentProps = {
  Icon: React.ReactNode | null;
  ActivityString: React.ReactNode;
  time: string;
};

const ActivityComponent: React.FC<ActivityComponentProps> = ({
  Icon,
  ActivityString,
  time,
}) => {
  const GetActivityIcon = () => {
    return Icon;
  };

  const GetActivityString = () => {
    return ActivityString;
  };

  return (
    <div className="flex items-center">
      <div className="relative">
        {/* Circle */}
        <div className="w-[30px] h-[30px] bg-sidebar-button-hover rounded-full flex items-center justify-center text-focus-text">
          <GetActivityIcon />
        </div>
      </div>
      <div className="ml-1 flex items-start gap-x-1">
        <div className="pl-2 text-xs max-w-[180px]">
          <GetActivityString />
        </div>
        <div className="text-[10px] w-12 ml-1 text-nonfocus-text">{time}</div>
      </div>
    </div>
  );
};

export default ActivityComponent;
