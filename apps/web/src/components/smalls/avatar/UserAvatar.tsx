import React from "react";
import { cn } from "@/lib/utils";
import { GetAvatarFromName } from "@/utils/helpers";

type AvatarProps = {
  size: number;
  name: string;
  image?: string;
  index: number;
  className?: string;
};

const UserAvatar: React.FC<AvatarProps> = ({
  size,
  name,
  image,
  index,
  className,
}) => {
  return (
    <>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={cn(
            `h-${size} w-${size} ${
              index !== 0 && size > 6 ? "-ml-2" : index !== 0 ? "-ml-[6px]" : ""
            } rounded-full bg-avatar border-2`,
            className
          )}
          src={image}
          alt={name}
        />
      ) : (
        <div
          className={cn(
            `h-${size} w-${size} ${
              index !== 0 && size > 6 ? "-ml-2" : index !== 0 ? "-ml-[6px]" : ""
            } rounded-full ${
              size <= 6 ? "text-[8px]" : "text-xs"
            } bg-avatar grid place-content-center text-white border-2 rounded-full`,
            className
          )}
        >
          {GetAvatarFromName(name)}
        </div>
      )}
    </>
  );
};

export default UserAvatar;
